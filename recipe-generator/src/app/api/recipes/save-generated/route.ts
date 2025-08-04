import { NextRequest, NextResponse } from "next/server";
import { getRecipeDb } from "../../../../../api/database/mongodb";

export async function POST(request: NextRequest) {
  try {
    // Verify internal API key for security
    const authHeader = request.headers.get("authorization");
    const internalApiKey = process.env.INTERNAL_API_KEY;

    if (
      !authHeader ||
      !internalApiKey ||
      authHeader !== `Bearer ${internalApiKey}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipe = await request.json();

    // Validate required fields
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      return NextResponse.json(
        { error: "Invalid recipe data" },
        { status: 400 }
      );
    }

    console.log("Saving AI-generated recipe:", recipe.title);

    // Save to database
    const recipeDb = await getRecipeDb();
    const savedRecipe = await recipeDb.createRecipe({
      ...recipe,
      generated_by: "ai",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      recipe_id: savedRecipe._id,
      saved_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error saving AI recipe:", error);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}
