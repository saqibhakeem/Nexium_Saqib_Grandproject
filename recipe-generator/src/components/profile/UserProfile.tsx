"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface UserPreferences {
  dietary_preferences: string[];
  cooking_skill: "beginner" | "intermediate" | "advanced";
  favorite_cuisines: string[];
}

export function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietary_preferences: [],
    cooking_skill: "beginner",
    favorite_cuisines: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dietaryOptions = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "keto",
    "low-carb",
    "low-sodium",
    "paleo",
  ];

  const cuisineOptions = [
    "italian",
    "asian",
    "mexican",
    "american",
    "indian",
    "mediterranean",
    "french",
    "thai",
    "chinese",
    "japanese",
  ];

  const skillLevels = [
    {
      value: "beginner",
      label: "Beginner",
      description: "Simple recipes with basic techniques",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "Moderate complexity with some advanced techniques",
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "Complex recipes and professional techniques",
    },
  ];

  useEffect(() => {
    if (user) {
      setPreferences({
        dietary_preferences: user.dietary_preferences || [],
        cooking_skill: user.cooking_skill || "beginner",
        favorite_cuisines: user.favorite_cuisines || [],
      });
    }
  }, [user]);

  const handleDietaryToggle = (option: string) => {
    setPreferences((prev) => ({
      ...prev,
      dietary_preferences: prev.dietary_preferences.includes(option)
        ? prev.dietary_preferences.filter((p) => p !== option)
        : [...prev.dietary_preferences, option],
    }));
  };

  const handleCuisineToggle = (option: string) => {
    setPreferences((prev) => ({
      ...prev,
      favorite_cuisines: prev.favorite_cuisines.includes(option)
        ? prev.favorite_cuisines.filter((c) => c !== option)
        : [...prev.favorite_cuisines, option],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Preferences updated successfully!");
        await refreshUser();
      } else {
        setMessage(data.error || "Failed to update preferences");
      }
    } catch {
      setMessage("Failed to update preferences. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Please sign in to view your profile.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              👤 Your Profile
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Customize your cooking preferences for better recipe suggestions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Profile Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Member Since
                  </label>
                  <Input
                    value={new Date(user.created_at).toLocaleDateString()}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Saved Recipes
                    </label>
                    <div className="text-2xl font-bold text-orange-500">
                      {user.stats?.saved_recipes || 0}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Generated Recipes
                    </label>
                    <div className="text-2xl font-bold text-blue-500">
                      {user.stats?.generated_recipes || 0}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card>
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                  Recipe Preferences
                </h2>

                <div className="space-y-6">
                  {/* Cooking Skill */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Cooking Skill Level
                    </label>
                    <div className="space-y-3">
                      {skillLevels.map((skill) => (
                        <label
                          key={skill.value}
                          className="flex items-start gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="cooking_skill"
                            value={skill.value}
                            checked={preferences.cooking_skill === skill.value}
                            onChange={(e) =>
                              setPreferences((prev) => ({
                                ...prev,
                                cooking_skill: e.target.value as
                                  | "beginner"
                                  | "intermediate"
                                  | "advanced",
                              }))
                            }
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              {skill.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {skill.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Dietary Preferences
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleDietaryToggle(option)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                            preferences.dietary_preferences.includes(option)
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Favorite Cuisines */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Favorite Cuisines
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {cuisineOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleCuisineToggle(option)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                            preferences.favorite_cuisines.includes(option)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full"
                  >
                    Update Preferences
                  </Button>

                  {message && (
                    <div
                      className={`p-4 rounded-lg ${
                        message.includes("✅")
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
