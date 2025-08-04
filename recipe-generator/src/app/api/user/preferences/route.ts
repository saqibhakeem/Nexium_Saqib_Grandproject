import { NextRequest, NextResponse } from "next/server";
import {
  supabaseAdmin,
  getUserProfile,
  updateUserProfile,
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

    return NextResponse.json({
      preferences: {
        dietary_preferences: userProfile.dietary_preferences || [],
        cooking_skill: userProfile.cooking_skill || "beginner",
        favorite_cuisines: userProfile.favorite_cuisines || [],
      },
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { dietary_preferences, cooking_skill, favorite_cuisines } =
      await request.json();

    // Validate cooking skill
    if (
      cooking_skill &&
      !["beginner", "intermediate", "advanced"].includes(cooking_skill)
    ) {
      return NextResponse.json(
        { error: "Invalid cooking skill level" },
        { status: 400 }
      );
    }

    // Update user preferences
    const updatedProfile = await updateUserProfile(user.user_id, {
      dietary_preferences: dietary_preferences || [],
      cooking_skill: cooking_skill || "beginner",
      favorite_cuisines: favorite_cuisines || [],
    });

    return NextResponse.json({
      message: "Preferences updated successfully",
      preferences: {
        dietary_preferences: updatedProfile.dietary_preferences,
        cooking_skill: updatedProfile.cooking_skill,
        favorite_cuisines: updatedProfile.favorite_cuisines,
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
