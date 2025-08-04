"use client";

import React, { useState } from "react";
import { Recipe, useRecipes } from "../../hooks/useRecipes";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface RecipeCardProps {
  recipe: Recipe;
  showSaveButton?: boolean;
  onUnsave?: () => void;
}

export function RecipeCard({
  recipe,
  showSaveButton = true,
  onUnsave,
}: RecipeCardProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { saveRecipe, unsaveRecipe } = useRecipes();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user || !recipe._id) return;

    setSaving(true);
    try {
      await saveRecipe(recipe._id);
      setSaved(true);
    } catch (error) {
      console.error("Failed to save recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUnsave = async () => {
    if (!user || !recipe._id) return;

    setSaving(true);
    try {
      await unsaveRecipe(recipe._id);
      if (onUnsave) {
        onUnsave();
      }
      setSaved(false);
    } catch (error) {
      console.error("Failed to unsave recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      padding="none"
      className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Recipe Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
        <span className="text-6xl">🍽️</span>
      </div>

      <div className="p-6">
        {/* Recipe Title */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {recipe.title}
        </h3>

        {/* Recipe Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            ⏱️ {recipe.total_time}min
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
          <span className="capitalize">{recipe.cuisine}</span>
        </div>

        {/* Dietary Tags */}
        {recipe.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.dietary_tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Quick Ingredients Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
            Key Ingredients:
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {recipe.ingredients.slice(0, 3).join(", ")}
            {recipe.ingredients.length > 3 &&
              ` +${recipe.ingredients.length - 3} more`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1"
          >
            {showDetails ? "Hide Details" : "View Recipe"}
          </Button>

          {user && showSaveButton && (
            <>
              {saved || recipe.bookmarked_at ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUnsave}
                  loading={saving}
                >
                  ❤️ Saved
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  loading={saving}
                >
                  🤍 Save
                </Button>
              )}
            </>
          )}
        </div>

        {/* Recipe Details */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Ingredients ({recipe.ingredients.length}):
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Instructions ({recipe.instructions.length} steps):
              </h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Prep Time:
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {recipe.prep_time}min
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Cook Time:
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {recipe.cook_time}min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
