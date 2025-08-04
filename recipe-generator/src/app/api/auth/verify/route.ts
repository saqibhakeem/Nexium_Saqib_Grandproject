import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../api/database/supabase";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Verify the magic link token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from("magic_link_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single();

    if (tokenError || !tokenData) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Mark token as used
    await supabaseAdmin
      .from("magic_link_tokens")
      .update({ used: true })
      .eq("token", token);

    // Check if user exists in our user_profiles table
    const { data: existingProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("email", tokenData.email)
      .single();

    let userId;

    if (existingProfile) {
      // User exists, use their ID
      userId = existingProfile.id;
      console.log("Existing user logged in:", tokenData.email);
    } else {
      // Create new user profile
      const { data: newProfile, error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .insert({
          email: tokenData.email,
          created_at: new Date().toISOString(),
          dietary_preferences: [],
          cooking_skill: "beginner",
          favorite_cuisines: [],
        })
        .select()
        .single();

      if (profileError || !newProfile) {
        console.error("Profile creation error:", profileError);
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        );
      }

      userId = newProfile.id;
      console.log("New user created:", tokenData.email);
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    console.log("Creating session for user:", userId);
    console.log("Session token:", sessionToken);
    console.log("Expires at:", sessionExpiresAt.toISOString());

    // Store session
    const { error: sessionError } = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: sessionExpiresAt.toISOString(),
      });

    if (sessionError) {
      console.error("Session creation error:", sessionError);
      console.error("UserId:", userId, "Type:", typeof userId);
      console.error("SessionToken:", sessionToken);
      console.error("ExpiresAt:", sessionExpiresAt.toISOString());
      return NextResponse.json(
        {
          error:
            "Failed to create session. Error: " + JSON.stringify(sessionError),
        },
        { status: 500 }
      );
    }

    // Create response with session cookie
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("✅ Authentication successful for:", tokenData.email);
    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
