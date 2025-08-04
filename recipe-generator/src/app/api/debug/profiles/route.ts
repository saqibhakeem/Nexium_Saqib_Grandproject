import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../api/database/supabase";

export async function GET() {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("user_profiles")
      .select("*");

    if (error) {
      console.error("Error fetching profiles:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from("user_sessions")
      .select("*");

    if (sessionError) {
      console.error("Error fetching sessions:", sessionError);
      return NextResponse.json(
        { error: sessionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profiles,
      sessions,
      profileCount: profiles?.length || 0,
      sessionCount: sessions?.length || 0,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
