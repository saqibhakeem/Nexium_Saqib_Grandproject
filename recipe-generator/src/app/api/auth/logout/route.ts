import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../api/database/supabase";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session-token")?.value;

    if (sessionToken) {
      // Delete session from database
      await supabaseAdmin
        .from("user_sessions")
        .delete()
        .eq("session_token", sessionToken);
    }

    // Create response and clear session cookie
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
