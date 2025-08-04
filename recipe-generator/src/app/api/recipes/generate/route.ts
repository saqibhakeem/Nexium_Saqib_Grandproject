import { NextRequest, NextResponse } from "next/server";
import { getRecipeDb, Recipe } from "../../../../../api/database/mongodb";
import { supabaseAdmin } from "../../../../../api/database/supabase";
import { geminiRecipeGenerator } from "../../../../../ai/services/gemini-recipe-generator";

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

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);

    const body = await request.json();
    const {
      ingredients,
      dietary_preferences = [],
      cuisine_preference = "",
      difficulty_preference = "any",
      cooking_time = "any",
    } = body;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return NextResponse.json(
        { error: "Ingredients are required" },
        { status: 400 }
      );
    }

    // First, check if we have existing recipes with these ingredients
    console.log("🔗 Attempting to get recipe database...");
    const recipeDb = await getRecipeDb();
    console.log("✅ Recipe database connected successfully");

    const existingRecipes = await recipeDb.getRecipesByIngredients(
      ingredients,
      3
    );

    let recipes: Recipe[] = [];

    if (existingRecipes.length > 0) {
      // Filter existing recipes based on preferences
      recipes = existingRecipes.filter((recipe) => {
        let matches = true;

        // Filter by dietary preferences
        if (dietary_preferences.length > 0) {
          matches =
            matches &&
            dietary_preferences.some((pref: string) =>
              recipe.dietary_tags.includes(pref.toLowerCase())
            );
        }

        // Filter by cuisine
        if (cuisine_preference && cuisine_preference !== "any") {
          matches =
            matches &&
            recipe.cuisine
              .toLowerCase()
              .includes(cuisine_preference.toLowerCase());
        }

        // Filter by difficulty
        if (difficulty_preference && difficulty_preference !== "any") {
          matches =
            matches &&
            recipe.difficulty === difficulty_preference.toLowerCase();
        }

        return matches;
      });
    }

    // If we don't have enough matching recipes, generate new ones via AI
    if (recipes.length < 2) {
      try {
        const aiRecipes = await generateRecipesWithAI({
          ingredients,
          dietary_preferences,
          cuisine_preference,
          difficulty_preference,
          cooking_time,
        });

        // Save AI-generated recipes to database
        for (const aiRecipe of aiRecipes) {
          const savedRecipe = await recipeDb.createRecipe({
            ...aiRecipe,
            generated_by: "ai",
            source_ingredients: ingredients,
            user_id: user?.user_id,
          });
          recipes.push(savedRecipe);
        }
      } catch (aiError) {
        console.error("AI generation failed:", aiError);
        // If AI fails, return existing recipes or error
        if (recipes.length === 0) {
          return NextResponse.json(
            { error: "Unable to generate recipes at this time" },
            { status: 500 }
          );
        }
      }
    }

    // Log generation history if user is logged in
    if (user) {
      await supabaseAdmin.from("recipe_generation_history").insert({
        user_id: user.user_id,
        ingredients,
        dietary_preferences,
        cuisine_preference,
        difficulty_preference,
        generated_recipe_ids: recipes.map((r) => r._id || ""),
      });
    }

    return NextResponse.json({
      recipes: recipes.slice(0, 5), // Return top 5 recipes
      total: recipes.length,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// AI Recipe Generation Function
async function generateRecipesWithAI(params: {
  ingredients: string[];
  dietary_preferences: string[];
  cuisine_preference: string;
  difficulty_preference: string;
  cooking_time: string;
}) {
  const {
    ingredients,
    dietary_preferences,
    cuisine_preference,
    difficulty_preference,
    cooking_time,
  } = params;

  console.log("Generating recipes with AI:", params);

  try {
    // Generate recipe using Gemini AI service
    const recipe = await geminiRecipeGenerator.generateRecipe({
      ingredients,
      dietary_preferences,
      cuisine_preference,
      difficulty_preference,
      cooking_time,
      servings: 4, // Default servings
    });

    // Return as array for compatibility with existing code
    return [recipe];
  } catch (error) {
    console.error("AI generation failed:", error);

    // Fallback to mock recipe if AI fails
    const mockRecipe = {
      title: `Delicious ${cuisine_preference || "Fusion"} Dish with ${
        ingredients[0]
      }`,
      description: `A wonderful ${
        difficulty_preference || "medium"
      } difficulty recipe featuring ${ingredients.slice(0, 3).join(", ")}.`,
      ingredients: ingredients.map(
        (ing: string, index: number) =>
          `${index + 1} ${index % 2 === 0 ? "cup" : "piece"} ${ing}`
      ),
      instructions: [
        "Prepare all ingredients and arrange them on your workspace.",
        `Cook the ${ingredients[0]} according to package directions.`,
        "Combine all ingredients in a large bowl.",
        "Season to taste and serve immediately.",
        "Enjoy your delicious meal!",
      ],
      prep_time: 15,
      cook_time: parseInt(cooking_time?.replace(/\D/g, "") || "20"),
      total_time: 35,
      difficulty: (difficulty_preference || "medium") as
        | "easy"
        | "medium"
        | "hard",
      cuisine: cuisine_preference || "fusion",
      dietary_tags: dietary_preferences.map((pref) => pref.toLowerCase()),
      tips: [
        "Use fresh ingredients for best results",
        "Adjust seasoning to your taste",
      ],
      nutrition_info: {
        calories: 250,
        protein: "15g",
        carbs: "30g",
        fat: "8g",
      },
    };

    return [mockRecipe];
  }
}
