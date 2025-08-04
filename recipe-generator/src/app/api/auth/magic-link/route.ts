import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../api/database/supabase";
import { sendMagicLinkEmail } from "../../../../../api/utils/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store the magic link token in Supabase
    const { error } = await supabaseAdmin.from("magic_link_tokens").insert({
      email: email.toLowerCase(),
      token,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          error:
            "Failed to create magic link. Please ensure the magic_link_tokens table exists in Supabase.",
        },
        { status: 500 }
      );
    }

    // Create magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

    // Send magic link email
    try {
      await sendMagicLinkEmail(email, magicLink);
      console.log("🔗 Magic link sent to:", email);

      return NextResponse.json({
        message:
          "Magic link sent to your email! Check your inbox and spam folder.",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // If email fails, log the magic link for development
      if (process.env.NODE_ENV === "development") {
        console.log("🔗 Magic Link for", email);
        console.log("📧 Click this link to login:", magicLink);
        console.log("⏰ Expires in 15 minutes");

        return NextResponse.json({
          message:
            "Email sending failed, but magic link created! Check your server console for the login link (development mode).",
        });
      }

      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
