import OpenAI from "openai";

// Get Gemini API key from system environment variables
const getGeminiApiKey = () => {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY
  );
};

// Initialize Gemini client using OpenAI SDK
const gemini = new OpenAI({
  apiKey: getGeminiApiKey()!,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export interface RecipeGenerationParams {
  ingredients: string[];
  dietary_preferences: string[];
  cuisine_preference?: string;
  difficulty_preference?: string;
  cooking_time?: string;
  servings?: number;
}

export interface GeneratedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  total_time: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
  dietary_tags: string[];
  description?: string;
  tips?: string[];
  nutrition_info?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export class GeminiRecipeGenerator {
  private buildPrompt(params: RecipeGenerationParams): string {
    const {
      ingredients,
      dietary_preferences,
      cuisine_preference,
      difficulty_preference,
      cooking_time,
      servings = 4,
    } = params;

    return `You are a professional chef AI assistant. Generate a detailed, creative recipe using the following ingredients and constraints:

AVAILABLE INGREDIENTS: ${ingredients.join(", ")}

REQUIREMENTS:
- Use as many of the provided ingredients as possible
- Serve ${servings} people
- Recipe should be ${difficulty_preference || "any difficulty level"}
- Cooking time: ${cooking_time || "flexible"}
- Cuisine style: ${cuisine_preference || "any cuisine"}
- Dietary restrictions: ${
      dietary_preferences.length > 0 ? dietary_preferences.join(", ") : "none"
    }

RESPONSE FORMAT:
Please respond with a JSON object containing:
{
  "title": "Creative recipe name",
  "description": "Brief description of the dish",
  "ingredients": ["1 cup ingredient1", "2 tbsp ingredient2", ...],
  "instructions": ["Step 1: ...", "Step 2: ...", ...],
  "prep_time": 15,
  "cook_time": 25,
  "total_time": 40,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine type",
  "dietary_tags": ["vegetarian", "gluten-free", ...],
  "tips": ["Helpful cooking tip 1", "Helpful cooking tip 2"],
  "nutrition_info": {
    "calories": 250,
    "protein": "15g",
    "carbs": "30g",
    "fat": "8g"
  }
}

Make sure all measurements are specific and instructions are clear and detailed.`;
  }

  async generateRecipe(
    params: RecipeGenerationParams
  ): Promise<GeneratedRecipe> {
    try {
      const prompt = this.buildPrompt(params);

      const response = await gemini.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a professional chef AI that creates detailed, practical recipes. Always respond with valid JSON only, no additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from Gemini");
      }

      // Parse the JSON response
      let recipe: GeneratedRecipe;
      try {
        recipe = JSON.parse(content) as GeneratedRecipe;
      } catch {
        // If direct parsing fails, try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in Gemini response");
        }
        recipe = JSON.parse(jsonMatch[0]) as GeneratedRecipe;
      }

      // Validate and normalize the recipe
      return this.validateAndNormalizeRecipe(recipe, params);
    } catch (error) {
      console.error("Gemini generation error:", error);
      // Return a fallback recipe if generation fails
      return this.generateFallbackRecipe(params);
    }
  }

  private validateAndNormalizeRecipe(
    recipe: GeneratedRecipe,
    params: RecipeGenerationParams
  ): GeneratedRecipe {
    // Ensure required fields are present
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      throw new Error("Invalid recipe: missing required fields");
    }

    // Normalize difficulty
    if (!["easy", "medium", "hard"].includes(recipe.difficulty)) {
      recipe.difficulty = "medium";
    }

    // Ensure dietary tags match preferences
    recipe.dietary_tags = params.dietary_preferences;

    // Set cuisine if not provided
    if (!recipe.cuisine) {
      recipe.cuisine = params.cuisine_preference || "fusion";
    }

    // Ensure minimum values
    if (!recipe.prep_time || recipe.prep_time < 5) recipe.prep_time = 10;
    if (!recipe.cook_time || recipe.cook_time < 0) recipe.cook_time = 15;
    if (!recipe.total_time)
      recipe.total_time = recipe.prep_time + recipe.cook_time;

    return recipe;
  }

  private generateFallbackRecipe(
    params: RecipeGenerationParams
  ): GeneratedRecipe {
    const mainIngredient = params.ingredients[0] || "mixed vegetables";

    return {
      title: `Simple ${
        mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)
      } Dish`,
      ingredients: [
        ...params.ingredients.map((ing) => `1 portion ${ing}`),
        "2 tbsp olive oil",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Prepare all ingredients by washing and cutting as needed",
        "Heat olive oil in a large pan over medium heat",
        `Add ${mainIngredient} and cook for 5-7 minutes`,
        "Add remaining ingredients and cook until tender",
        "Season with salt and pepper to taste",
        "Serve hot and enjoy!",
      ],
      prep_time: 10,
      cook_time: 15,
      total_time: 25,
      difficulty: "easy",
      cuisine: params.cuisine_preference || "fusion",
      dietary_tags: params.dietary_preferences,
      description: `A simple and delicious ${mainIngredient} dish perfect for any meal.`,
      tips: [
        "Feel free to adjust seasoning to your taste",
        "You can add other vegetables for more variety",
      ],
      nutrition_info: {
        calories: 200,
        protein: "8g",
        carbs: "25g",
        fat: "6g",
      },
    };
  }
}

// Singleton instance
export const geminiRecipeGenerator = new GeminiRecipeGenerator();
