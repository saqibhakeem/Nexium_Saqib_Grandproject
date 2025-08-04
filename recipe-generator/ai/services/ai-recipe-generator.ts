import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

export class AIRecipeGenerator {
  private buildPrompt(params: RecipeGenerationParams): string {
    const {
      ingredients,
      dietary_preferences,
      cuisine_preference,
      difficulty_preference,
      cooking_time,
      servings = 4,
    } = params;

    const prompt = `You are a professional chef AI assistant. Generate a detailed, creative recipe using the following ingredients and constraints:

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
  "description": "Brief appetizing description (2-3 sentences)",
  "ingredients": ["Detailed ingredient list with measurements"],
  "instructions": ["Step-by-step cooking instructions"],
  "prep_time": number_in_minutes,
  "cook_time": number_in_minutes,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine_type",
  "dietary_tags": ["applicable_dietary_tags"],
  "tips": ["Helpful cooking tips"],
  "nutrition_info": {
    "calories": estimated_calories_per_serving,
    "protein": "protein_amount",
    "carbs": "carb_amount", 
    "fat": "fat_amount"
  }
}

IMPORTANT:
- Make the recipe practical and delicious
- Include precise measurements and cooking times
- Ensure instructions are clear and detailed
- Only use the provided ingredients plus common pantry staples (salt, pepper, oil, etc.)
- Adapt the recipe to meet all dietary restrictions
- Make the title creative and appetizing`;

    return prompt;
  }

  async generateWithOpenAI(
    params: RecipeGenerationParams
  ): Promise<GeneratedRecipe> {
    try {
      const prompt = this.buildPrompt(params);

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a professional chef AI that creates detailed, practical recipes. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      const recipe = JSON.parse(content) as GeneratedRecipe;

      // Calculate total time and validate
      recipe.total_time = recipe.prep_time + recipe.cook_time;

      return this.validateAndNormalizeRecipe(recipe, params);
    } catch (error) {
      console.error("OpenAI generation error:", error);
      throw new Error("Failed to generate recipe with OpenAI");
    }
  }

  async generateWithAnthropic(
    params: RecipeGenerationParams
  ): Promise<GeneratedRecipe> {
    try {
      const prompt = this.buildPrompt(params);

      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        temperature: 0.8,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== "text") {
        throw new Error("Invalid response type from Anthropic");
      }

      // Extract JSON from the response (Claude sometimes wraps it in markdown)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Anthropic response");
      }

      const recipe = JSON.parse(jsonMatch[0]) as GeneratedRecipe;

      // Calculate total time and validate
      recipe.total_time = recipe.prep_time + recipe.cook_time;

      return this.validateAndNormalizeRecipe(recipe, params);
    } catch (error) {
      console.error("Anthropic generation error:", error);
      throw new Error("Failed to generate recipe with Anthropic");
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

  async generateRecipe(
    params: RecipeGenerationParams,
    preferredProvider: "openai" | "anthropic" = "openai"
  ): Promise<GeneratedRecipe> {
    try {
      if (preferredProvider === "openai" && process.env.OPENAI_API_KEY) {
        return await this.generateWithOpenAI(params);
      } else if (
        preferredProvider === "anthropic" &&
        process.env.ANTHROPIC_API_KEY
      ) {
        return await this.generateWithAnthropic(params);
      } else {
        // Fallback to the other provider
        const fallbackProvider =
          preferredProvider === "openai" ? "anthropic" : "openai";
        if (fallbackProvider === "openai" && process.env.OPENAI_API_KEY) {
          return await this.generateWithOpenAI(params);
        } else if (
          fallbackProvider === "anthropic" &&
          process.env.ANTHROPIC_API_KEY
        ) {
          return await this.generateWithAnthropic(params);
        } else {
          throw new Error("No AI provider available");
        }
      }
    } catch (error) {
      console.error("Recipe generation failed:", error);
      // Return a fallback recipe if all else fails
      return this.generateFallbackRecipe(params);
    }
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
      description: `A simple and delicious dish featuring ${mainIngredient}`,
      tips: [
        "Taste and adjust seasoning as needed",
        "Serve immediately for best results",
      ],
    };
  }
}

// Singleton instance
export const aiRecipeGenerator = new AIRecipeGenerator();
