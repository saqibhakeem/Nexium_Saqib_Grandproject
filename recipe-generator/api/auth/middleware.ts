import { NextRequest } from "next/server";
import { supabaseAdmin } from "../database/supabase";

export interface AuthenticatedUser {
  user_id: string;
  email: string;
  session_token: string;
  expires_at: string;
}

export async function getUserFromSession(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const sessionToken = request.cookies.get("session-token")?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const { data: session, error } = await supabaseAdmin
      .from("user_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .single();

    if (error || !session) {
      return null;
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Clean up expired session
      await supabaseAdmin
        .from("user_sessions")
        .delete()
        .eq("session_token", sessionToken);

      return null;
    }

    return session as AuthenticatedUser;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

export function requireAuth() {
  return async (
    request: NextRequest
  ): Promise<AuthenticatedUser | Response> => {
    const user = await getUserFromSession(request);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return user;
  };
}
