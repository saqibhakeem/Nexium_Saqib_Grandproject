// Simple MongoDB connection test
const { MongoClient } = require("mongodb");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

console.log("🔍 Testing MongoDB Connection...");
console.log("📡 URI (masked):", uri?.replace(/\/\/.*@/, "//***:***@"));

const options = {
  tls: true,
  tlsAllowInvalidCertificates: true,
  retryWrites: true,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4, // Force IPv4
};

async function testConnection() {
  const client = new MongoClient(uri, options);

  try {
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully!");

    // Test ping
    await client.db("recipe_generator").admin().ping();
    console.log("✅ Ping successful!");

    await client.close();
    console.log("✅ Connection closed properly");
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error("   Error type:", error.constructor.name);
    console.error("   Error message:", error.message);
    if (error.code) console.error("   Error code:", error.code);
    if (error.codeName) console.error("   Error codeName:", error.codeName);

    // More specific error analysis
    if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 DNS Resolution Failed");
      console.log("   This usually means:");
      console.log("   - Network/DNS issues");
      console.log("   - ISP blocking MongoDB domains");
      console.log("   - Firewall/antivirus blocking connection");
    } else if (error.message.includes("Authentication")) {
      console.log("\n💡 Authentication Failed");
      console.log("   Check your username/password in the connection string");
    } else if (
      error.message.includes("not authorized") ||
      error.code === 8000
    ) {
      console.log("\n💡 IP Access Denied");
      console.log("   Your IP is not whitelisted in MongoDB Atlas");
      console.log("   Add this IP: 223.123.106.213");
    } else if (error.message.includes("timeout")) {
      console.log("\n💡 Connection Timeout");
      console.log("   Network connectivity issues or server overload");
    }
  }
}

testConnection();
