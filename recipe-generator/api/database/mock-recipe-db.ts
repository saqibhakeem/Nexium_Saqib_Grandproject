// Temporary mock database for development when MongoDB is unavailable
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

export interface SavedRecipe {
  _id?: string;
  user_id: string;
  recipe_id: string;
  saved_at: Date;
  personal_rating?: number;
  personal_notes?: string;
}

// In-memory storage for development
const mockRecipes: Recipe[] = [];
const mockSavedRecipes: SavedRecipe[] = [];
let recipeIdCounter = 1;

export class MockRecipeDatabase {
  // Create a new recipe
  async createRecipe(
    recipe: Omit<Recipe, "_id" | "created_at">
  ): Promise<Recipe> {
    const newRecipe: Recipe = {
      ...recipe,
      _id: `recipe_${recipeIdCounter++}`,
      created_at: new Date(),
      rating: 0,
      rating_count: 0,
    };

    mockRecipes.push(newRecipe);
    console.log(`📝 Mock DB: Created recipe "${newRecipe.title}"`);
    return newRecipe;
  }

  // Get recipes by ingredients
  async getRecipesByIngredients(
    ingredients: string[],
    limit: number = 10
  ): Promise<Recipe[]> {
    const filtered = mockRecipes.filter((recipe) =>
      recipe.source_ingredients.some((ing) =>
        ingredients.some((userIng) =>
          ing.toLowerCase().includes(userIng.toLowerCase())
        )
      )
    );

    return filtered
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  // Save a recipe for a user
  async saveRecipeForUser(
    userId: string,
    recipeId: string
  ): Promise<SavedRecipe> {
    const savedRecipe: SavedRecipe = {
      _id: `saved_${mockSavedRecipes.length + 1}`,
      user_id: userId,
      recipe_id: recipeId,
      saved_at: new Date(),
    };

    mockSavedRecipes.push(savedRecipe);
    console.log(`💾 Mock DB: Saved recipe ${recipeId} for user ${userId}`);
    return savedRecipe;
  }

  // Get user's saved recipes
  async getUserSavedRecipes(userId: string): Promise<Recipe[]> {
    const userSavedRecipes = mockSavedRecipes.filter(
      (sr) => sr.user_id === userId
    );
    const recipeIds = userSavedRecipes.map((sr) => sr.recipe_id);

    return mockRecipes.filter((recipe) => recipeIds.includes(recipe._id || ""));
  }

  // Search recipes
  async searchRecipes(query: string, limit: number = 10): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = mockRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some((ing) =>
          ing.toLowerCase().includes(lowerQuery)
        ) ||
        recipe.cuisine.toLowerCase().includes(lowerQuery) ||
        recipe.dietary_tags.some((tag) =>
          tag.toLowerCase().includes(lowerQuery)
        )
    );

    return filtered
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
}

// Helper function to get mock recipe database instance
export async function getMockRecipeDb(): Promise<MockRecipeDatabase> {
  console.log("🔧 Using mock database (MongoDB unavailable)");
  return new MockRecipeDatabase();
}
