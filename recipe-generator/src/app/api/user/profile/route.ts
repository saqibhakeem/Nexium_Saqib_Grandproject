import { NextRequest, NextResponse } from "next/server";
import {
  supabaseAdmin,
  getUserProfile,
} from "../../../../../api/database/supabase";

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

    const userProfile = await getUserProfile(user.user_id);

    // Get additional stats
    const { count: bookmarkCount } = await supabaseAdmin
      .from("recipe_bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.user_id);

    const { count: generationCount } = await supabaseAdmin
      .from("recipe_generation_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.user_id);

    return NextResponse.json({
      profile: {
        id: userProfile.id,
        email: userProfile.email,
        created_at: userProfile.created_at,
        dietary_preferences: userProfile.dietary_preferences || [],
        cooking_skill: userProfile.cooking_skill || "beginner",
        favorite_cuisines: userProfile.favorite_cuisines || [],
        stats: {
          saved_recipes: bookmarkCount || 0,
          generated_recipes: generationCount || 0,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
