"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Recipe } from "../../hooks/useRecipes";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../ui/Card";
import { RecipeCard } from "./RecipeCard";

export function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load saved recipes when user changes
  useEffect(() => {
    if (!user) return;

    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/recipes/saved", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch saved recipes");
        }

        setRecipes(data.recipes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load saved recipes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [user]);

  const loadSavedRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/recipes/saved", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch saved recipes");
      }

      setRecipes(data.recipes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load saved recipes"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnsave = (recipeId: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to view your saved recipes.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              ❤️ Your Saved Recipes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              All your favorite recipes in one place
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <Card className="text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Error Loading Recipes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
              <button
                onClick={loadSavedRecipes}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </Card>
          ) : recipes.length === 0 ? (
            <>
              {console.log(
                "🔍 Frontend: Rendering empty state, recipes.length =",
                recipes.length
              )}
              {console.log("🔍 Frontend: Recipes array =", recipes)}
              <Card className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  No Saved Recipes Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Start exploring and save recipes you love!
                </p>
                <a
                  href="/recipes"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  Generate Recipes ✨
                </a>
              </Card>
            </>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{recipes.length}</span> saved
                  recipe{recipes.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    showSaveButton={false}
                    onUnsave={() => recipe._id && handleUnsave(recipe._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
