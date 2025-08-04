"use client";

import { useState, useCallback } from "react";

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
  personal_rating?: number;
  personal_notes?: string;
  bookmarked_at?: string;
}

interface GenerateRecipesParams {
  ingredients: string[];
  dietary_preferences?: string[];
  cuisine_preference?: string;
  difficulty_preference?: string;
  cooking_time?: string;
}

export function useRecipes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecipes = useCallback(
    async (params: GenerateRecipesParams): Promise<Recipe[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/recipes/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to generate recipes"
          );
        }

        // Handle both old format (data.recipes) and new format (data.recipe)
        if (data.recipes) {
          return data.recipes;
        } else if (data.recipe) {
          return [data.recipe];
        } else {
          throw new Error("No recipes generated");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate recipes";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const saveRecipe = useCallback(
    async (
      recipeId: string,
      rating?: number,
      notes?: string
    ): Promise<void> => {
      try {
        const response = await fetch("/api/recipes/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            recipe_id: recipeId,
            personal_rating: rating,
            personal_notes: notes,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to save recipe");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save recipe";
        throw new Error(errorMessage);
      }
    },
    []
  );

  const unsaveRecipe = useCallback(async (recipeId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/recipes/save?recipe_id=${recipeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove recipe");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove recipe";
      throw new Error(errorMessage);
    }
  }, []);

  const getSavedRecipes = useCallback(async (): Promise<Recipe[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recipes/saved", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch saved recipes");
      }

      return data.recipes;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch saved recipes";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateRecipes,
    saveRecipe,
    unsaveRecipe,
    getSavedRecipes,
  };
}
