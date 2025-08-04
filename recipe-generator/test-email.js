// Test SMTP configuration
const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: "Test Email from Recipe Generator",
      text: "If you receive this, your SMTP is working!",
    });

    console.log("✅ Email sent successfully!", info.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error.message);
  }
}

testEmail();
