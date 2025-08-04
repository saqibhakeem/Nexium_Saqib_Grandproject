import { NextRequest, NextResponse } from "next/server";
import { getRecipeDb } from "../../../../../api/database/mongodb";
import { supabaseAdmin } from "../../../../../api/database/supabase";
import { ObjectId } from "mongodb";

// Middleware to get user from session
async function getUserFromSession(request: NextRequest) {
  const sessionToken = request.cookies.get("session-token")?.value;

  if (!sessionToken) {
    return null;
  }

  const { data: session } = await supabaseAdmin
    .from("user_sessions")
    .select("*")
    .eq("session_token", sessionToken)
    .single();

  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }

  return session;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's bookmarked recipes
    const { data: bookmarks, error: bookmarkError } = await supabaseAdmin
      .from("recipe_bookmarks")
      .select("*")
      .eq("user_id", user.user_id)
      .order("bookmarked_at", { ascending: false });

    if (bookmarkError) {
      console.error("Fetch bookmarks error:", bookmarkError);
      return NextResponse.json(
        { error: "Failed to fetch saved recipes" },
        { status: 500 }
      );
    }

    if (!bookmarks || bookmarks.length === 0) {
      return NextResponse.json({
        recipes: [],
        total: 0,
      });
    }

    // Get recipe details from MongoDB
    const recipeDb = await getRecipeDb();
    const recipeIds = bookmarks.map((bookmark) => bookmark.recipe_id);

    // Convert string IDs to ObjectIds for MongoDB search
    const objectIds = recipeIds.map(id => {
      try {
        return new ObjectId(id);
      } catch {
        return id; // fallback to string if not valid ObjectId
      }
    });

    // Fetch recipes from MongoDB using ObjectIds
    const recipes = await recipeDb.recipes
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Combine recipe data with bookmark data
    const savedRecipes = recipes.map((recipe) => {
      const bookmark = bookmarks.find(
        (b) => b.recipe_id === recipe._id?.toString()
      );
      return {
        ...recipe,
        personal_rating: bookmark?.personal_rating,
        personal_notes: bookmark?.personal_notes,
        bookmarked_at: bookmark?.bookmarked_at,
      };
    });

    return NextResponse.json({
      recipes: savedRecipes,
      total: savedRecipes.length,
    });
  } catch (error) {
    console.error("Get saved recipes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
