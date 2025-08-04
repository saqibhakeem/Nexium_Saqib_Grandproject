'use client'

import React, { useState } from 'react'
import { useRecipes, Recipe } from '../../hooks/useRecipes'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { RecipeCard } from './RecipeCard'

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('')
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [cuisinePreference, setCuisinePreference] = useState('')
  const [difficultyPreference, setDifficultyPreference] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { generateRecipes, loading, error } = useRecipes()

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 
    'keto', 'low-carb', 'low-sodium', 'paleo'
  ]

  const cuisineOptions = [
    'italian', 'asian', 'mexican', 'american', 'indian', 
    'mediterranean', 'french', 'thai', 'chinese', 'japanese'
  ]

  const difficultyOptions = [
    { value: '', label: 'Any difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ]

  const handleDietaryToggle = (option: string) => {
    setDietaryPreferences(prev => 
      prev.includes(option) 
        ? prev.filter(p => p !== option)
        : [...prev, option]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ingredients.trim()) {
      return
    }

    const ingredientList = ingredients
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)

    try {
      const generatedRecipes = await generateRecipes({
        ingredients: ingredientList,
        dietary_preferences: dietaryPreferences,
        cuisine_preference: cuisinePreference || undefined,
        difficulty_preference: difficultyPreference || undefined
      })
      
      setRecipes(generatedRecipes)
    } catch (err) {
      console.error('Recipe generation failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              🍳 Generate Your Perfect Recipe
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Enter your ingredients and preferences to get AI-powered recipe suggestions
            </p>
          </div>

          <Card className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Available Ingredients"
                placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                helpText="List all the ingredients you have available"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dietary Preferences (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleDietaryToggle(option)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        dietaryPreferences.includes(option)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cuisine Preference
                  </label>
                  <select
                    value={cuisinePreference}
                    onChange={(e) => setCuisinePreference(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Any cuisine</option>
                    {cuisineOptions.map(cuisine => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficultyPreference}
                    onChange={(e) => setDifficultyPreference(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {difficultyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                disabled={!ingredients.trim()}
              >
                Generate Recipes ✨
              </Button>

              {error && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
            </form>
          </Card>

          {recipes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Generated Recipes ({recipes.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={recipe._id || index} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
