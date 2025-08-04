import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create email transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<void> {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.log("📧 SMTP not configured, email would be sent to:", options.to);
    console.log("📝 Subject:", options.subject);
    console.log("📄 Content:", options.text || options.html);
    return;
  }

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
}

// Send magic link email specifically
export async function sendMagicLinkEmail(
  email: string,
  magicLink: string
): Promise<void> {
  const subject = "🪄 Your Magic Link for Recipe Generator";

  const text = `
Hello!

Click the link below to sign in to Recipe Generator:

${magicLink}

This link will expire in 15 minutes for security.

If you didn't request this, you can safely ignore this email.

Happy cooking! 🍳
Recipe Generator Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 32px; margin: 0;">🍳 Recipe Generator</h1>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #374151; margin-top: 0;">Your Magic Link is Ready! 🪄</h2>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">
          Click the button below to sign in to your Recipe Generator account:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLink}" 
             style="background-color: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Sign In to Recipe Generator
          </a>
        </div>
        
        <p style="color: #9ca3af; font-size: 14px; margin-bottom: 0;">
          <strong>Security Notice:</strong> This link will expire in 15 minutes and can only be used once.
        </p>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <p style="color: #9ca3af; font-size: 14px; margin: 0;">
          If you didn't request this magic link, you can safely ignore this email.
          <br>
          If the button doesn't work, copy and paste this link: ${magicLink}
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Happy cooking! 🍳<br>
          The Recipe Generator Team
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}
