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

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { recipe_id, personal_rating, personal_notes } = await request.json();

    if (!recipe_id) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    // Get the recipe from MongoDB to save complete data
    const recipeDb = await getRecipeDb();

    console.log(
      "🔍 Looking for recipe with ID:",
      recipe_id,
      "Type:",
      typeof recipe_id
    );

    // Since our createRecipe method returns _id as string, try string first
    let recipe = await recipeDb.recipes.findOne({ _id: recipe_id });

    // If not found with string, try ObjectId (this is the key fix)
    if (!recipe && ObjectId.isValid(recipe_id)) {
      try {
        const objectId = new ObjectId(recipe_id);
        // Use a direct approach to bypass TypeScript interface issues
        const db = (recipeDb as any).db;
        recipe = await db.collection("recipes").findOne({ _id: objectId });
        console.log("📄 Recipe found using ObjectId:", !!recipe);
      } catch (err) {
        console.log("❌ ObjectId search failed:", err);
      }
    }

    console.log("📄 Final recipe found:", !!recipe);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Check if recipe is already bookmarked
    const { data: existing } = await supabaseAdmin
      .from("recipe_bookmarks")
      .select("*")
      .eq("user_id", user.user_id)
      .eq("recipe_id", recipe_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Recipe already saved" },
        { status: 400 }
      );
    }

    // Save the recipe bookmark with complete data
    const { data, error } = await supabaseAdmin
      .from("recipe_bookmarks")
      .insert({
        user_id: user.user_id,
        recipe_id,
        recipe_title: recipe.title,
        recipe_data: recipe,
        personal_rating: personal_rating || null,
        personal_notes: personal_notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Save recipe error:", error);
      return NextResponse.json(
        { error: "Failed to save recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Recipe saved successfully",
      bookmark: data,
    });
  } catch (error) {
    console.error("Save recipe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recipe_id = searchParams.get("recipe_id");

    if (!recipe_id) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    // Remove the recipe bookmark
    const { error } = await supabaseAdmin
      .from("recipe_bookmarks")
      .delete()
      .eq("user_id", user.user_id)
      .eq("recipe_id", recipe_id);

    if (error) {
      console.error("Remove recipe error:", error);
      return NextResponse.json(
        { error: "Failed to remove recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Recipe removed successfully",
    });
  } catch (error) {
    console.error("Remove recipe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
