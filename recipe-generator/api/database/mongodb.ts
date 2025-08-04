import { MongoClient, Db, Collection } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (!process.env.MONGODB_DB_NAME) {
  throw new Error("Please define the MONGODB_DB_NAME environment variable");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

// Global variable to store the cached connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // MongoDB connection options for better SSL/TLS handling
  const options = {
    tls: true,
    tlsAllowInvalidCertificates: true, // Allow invalid certificates for Atlas connection
    retryWrites: true,
    serverSelectionTimeoutMS: 30000, // Increased timeout
    connectTimeoutMS: 30000, // Increased timeout
    socketTimeoutMS: 30000, // Added socket timeout
    maxPoolSize: 10,
    minPoolSize: 5,
    family: 4, // Force IPv4
  };

  console.log("🔗 Attempting to connect to MongoDB...");
  console.log("📡 URI (masked):", uri.replace(/\/\/.*@/, "//***:***@"));

  const client = new MongoClient(uri, options);

  try {
    // Test DNS resolution first
    console.log("� Testing network connectivity...");

    await client.connect();
    console.log("✅ Connected to MongoDB successfully");

    // Test the connection
    await client.db(dbName).admin().ping();
    console.log("✅ MongoDB ping successful");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");

    if (error instanceof Error) {
      console.error("   Error type:", error.constructor.name);
      console.error("   Error message:", error.message);
      if ("code" in error) console.error("   Error code:", error.code);
      if ("cause" in error) console.error("   Error cause:", error.cause);
    } else {
      console.error("   Unknown error:", error);
    }

    // Enhanced error handling for different error types
    if (error instanceof Error) {
      if (error.message.includes("ENOTFOUND")) {
        console.log("💡 DNS resolution failed. Possible solutions:");
        console.log("   1. Check your internet connection");
        console.log("   2. Try using a VPN (some ISPs block MongoDB Atlas)");
        console.log("   3. Check if your firewall is blocking MongoDB");
        console.log("   4. Try from a different network (mobile hotspot)");
        console.log("   5. Temporarily disable antivirus/firewall");
      } else if (error.message.includes("ETIMEOUT")) {
        console.log("💡 Connection timeout. Try:");
        console.log("   - Using a different network");
        console.log("   - Checking MongoDB Atlas network access settings");
      } else if (error.message.includes("Authentication failed")) {
        console.log("💡 Authentication error. Check:");
        console.log("   - Username and password in connection string");
        console.log("   - Database user permissions");
      } else if (
        error.message.includes("IP") ||
        error.message.includes("whitelist")
      ) {
        console.log("💡 IP Access error. Check:");
        console.log("   - Add your IP to MongoDB Atlas Network Access");
        console.log("   - Your current IP: 223.123.106.213");
      }
    }

    throw error;
  }

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Recipe interface
export interface Recipe {
  _id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  total_time: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
  dietary_tags: string[];
  rating?: number;
  rating_count?: number;
  image_url?: string;
  created_at: Date;
  user_id?: string;
  generated_by: "ai" | "user";
  source_ingredients: string[];
}

// Saved recipe interface
export interface SavedRecipe {
  _id?: string;
  user_id: string;
  recipe_id: string;
  saved_at: Date;
  personal_rating?: number;
  personal_notes?: string;
}

// Recipe database operations
export class RecipeDatabase {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  get recipes(): Collection<Recipe> {
    return this.db.collection<Recipe>("recipes");
  }

  get savedRecipes(): Collection<SavedRecipe> {
    return this.db.collection<SavedRecipe>("saved_recipes");
  }

  // Create a new recipe
  async createRecipe(
    recipe: Omit<Recipe, "_id" | "created_at">
  ): Promise<Recipe> {
    const newRecipe: Recipe = {
      ...recipe,
      created_at: new Date(),
      rating: 0,
      rating_count: 0,
    };

    const result = await this.recipes.insertOne(newRecipe);
    return { ...newRecipe, _id: result.insertedId.toString() };
  }

  // Get recipes by ingredients
  async getRecipesByIngredients(
    ingredients: string[],
    limit: number = 10
  ): Promise<Recipe[]> {
    const query = {
      source_ingredients: {
        $in: ingredients.map((ing) => new RegExp(ing, "i")),
      },
    };

    return await this.recipes
      .find(query)
      .sort({ rating: -1, created_at: -1 })
      .limit(limit)
      .toArray();
  }

  // Save a recipe for a user
  async saveRecipeForUser(
    userId: string,
    recipeId: string
  ): Promise<SavedRecipe> {
    const savedRecipe: SavedRecipe = {
      user_id: userId,
      recipe_id: recipeId,
      saved_at: new Date(),
    };

    await this.savedRecipes.insertOne(savedRecipe);
    return savedRecipe;
  }

  // Get user's saved recipes
  async getUserSavedRecipes(userId: string): Promise<Recipe[]> {
    const savedRecipes = await this.savedRecipes
      .find({ user_id: userId })
      .sort({ saved_at: -1 })
      .toArray();

    const recipeIds = savedRecipes.map((sr) => sr.recipe_id);

    return await this.recipes.find({ _id: { $in: recipeIds } }).toArray();
  }

  // Search recipes
  async searchRecipes(query: string, limit: number = 10): Promise<Recipe[]> {
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { ingredients: { $regex: query, $options: "i" } },
        { cuisine: { $regex: query, $options: "i" } },
        { dietary_tags: { $regex: query, $options: "i" } },
      ],
    };

    return await this.recipes
      .find(searchQuery)
      .sort({ rating: -1, created_at: -1 })
      .limit(limit)
      .toArray();
  }
}

// Helper function to get recipe database instance
export async function getRecipeDb(): Promise<RecipeDatabase> {
  const { db } = await connectToDatabase();
  return new RecipeDatabase(db);
}
