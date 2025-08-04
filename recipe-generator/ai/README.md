# AI Logic & n8n Workflows

# Recipe Generation System

## 🤖 AI Integration Overview

# n8n Workflow Setup for Recipe Generator

## Overview

This directory contains the n8n workflow configuration for AI-powered recipe generation. The workflow handles incoming requests, processes them through AI providers (OpenAI/Anthropic), and returns formatted recipes.

## Files

- `services/ai-recipe-generator.ts`: TypeScript AI service layer
- `workflows/recipe-generation.json`: Main n8n workflow configuration

## Workflow Features

- **Webhook Trigger**: Accepts POST requests with recipe generation parameters
- **Input Validation**: Validates and sanitizes incoming data
- **AI Provider Routing**: Supports both OpenAI and Anthropic with fallback
- **Response Processing**: Standardizes AI responses into consistent format
- **Database Integration**: Saves generated recipes to MongoDB
- **Error Handling**: Comprehensive error responses and logging

## Environment Variables Required

```
PREFERRED_AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
APP_BASE_URL=https://your-app.vercel.app
INTERNAL_API_KEY=your_internal_api_key
```

## Workflow Endpoints

- **Webhook URL**: `https://your-n8n-instance.com/webhook/recipe-generate`
- **Method**: POST
- **Headers**: Content-Type: application/json

## Request Format

```json
{
  "ingredients": ["chicken", "rice", "vegetables"],
  "dietary_preferences": ["gluten-free"],
  "cuisine_preference": "asian",
  "difficulty_preference": "medium",
  "cooking_time": "30 minutes",
  "servings": 4,
  "user_id": "user123"
}
```

## Response Format

```json
{
  "success": true,
  "recipe": {
    "_id": "recipe_id",
    "title": "Recipe Title",
    "description": "Recipe description",
    "ingredients": ["ingredient list"],
    "instructions": ["step-by-step instructions"],
    "prep_time": 15,
    "cook_time": 25,
    "total_time": 40,
    "difficulty": "medium",
    "cuisine": "asian",
    "dietary_tags": ["gluten-free"],
    "tips": ["cooking tips"],
    "nutrition_info": {},
    "generated_by": "ai",
    "created_at": "2024-01-15T12:00:00.000Z",
    "source_ingredients": ["original ingredients"]
  },
  "generation_info": {
    "ai_provider": "openai",
    "processing_time_ms": 2500,
    "generated_at": "2024-01-15T12:00:00.000Z"
  }
}
```

## Integration with Next.js App

The workflow integrates with your app through:

1. Recipe generation endpoint (`/api/recipes/generate`)
2. Database save endpoint (`/api/recipes/save-generated`)
3. Authentication via internal API key

## Testing

Use the n8n interface to test the workflow with sample data before deploying to production.

## 🔄 n8n Workflow Design

### Primary Workflow: Recipe Generation

1. **HTTP Request Trigger** - Receives ingredient data from frontend
2. **Data Processing Node** - Validates and formats input data
3. **AI Model Integration** - Connects to OpenAI/Anthropic API
4. **Recipe Formatting** - Structures the AI response
5. **Database Storage** - Saves recipe to MongoDB
6. **Response Node** - Returns formatted recipe to frontend

### Workflow Components

#### Input Processing

```javascript
// Expected input format
{
  "ingredients": ["chicken", "rice", "tomatoes", "onions"],
  "dietary_preferences": ["gluten-free", "low-sodium"],
  "cuisine_type": "asian",
  "cooking_time": "30",
  "difficulty": "intermediate",
  "servings": 4
}
```

#### AI Prompt Template

```javascript
const prompt = `
Create a delicious recipe using the following ingredients: ${ingredients.join(
  ", "
)}.

Requirements:
- Dietary preferences: ${dietary_preferences.join(", ")}
- Cuisine style: ${cuisine_type}
- Cooking time: approximately ${cooking_time} minutes
- Difficulty level: ${difficulty}
- Serves: ${servings} people

Please provide the recipe in the following JSON format:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "prep_time": number_in_minutes,
  "cook_time": number_in_minutes,
  "total_time": number_in_minutes,
  "servings": number_of_servings,
  "difficulty": "easy|medium|hard",
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity",
      "unit": "measurement unit"
    }
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "nutrition": {
    "calories": number_per_serving,
    "protein": "amount in grams",
    "carbs": "amount in grams",
    "fat": "amount in grams"
  },
  "tips": [
    "Cooking tip 1",
    "Cooking tip 2"
  ],
  "tags": ["tag1", "tag2"]
}
`;
```

#### Response Validation

```javascript
// Validate AI response structure
function validateRecipe(recipe) {
  const required = [
    "title",
    "ingredients",
    "instructions",
    "prep_time",
    "cook_time",
  ];
  return required.every((field) => recipe.hasOwnProperty(field));
}
```

## 🧠 AI Model Configuration

### Primary: OpenAI GPT-4

```javascript
{
  "model": "gpt-4-turbo-preview",
  "temperature": 0.7,
  "max_tokens": 2000,
  "top_p": 0.9,
  "frequency_penalty": 0.1,
  "presence_penalty": 0.1
}
```

### Fallback: Anthropic Claude

```javascript
{
  "model": "claude-3-sonnet-20240229",
  "max_tokens": 2000,
  "temperature": 0.7
}
```

## 📊 Quality Assurance

### Recipe Validation Rules

1. **Ingredient Safety** - Check for harmful combinations
2. **Cooking Logic** - Validate cooking times and temperatures
3. **Dietary Compliance** - Ensure dietary restrictions are met
4. **Nutritional Balance** - Basic nutritional validation
5. **Instruction Clarity** - Check for clear, actionable steps

### Error Handling

```javascript
// Workflow error handling
if (aiResponse.error) {
  return {
    success: false,
    message: "Unable to generate recipe. Please try again.",
    fallback: "basic_recipe_template",
  };
}
```

## 🔄 Workflow Endpoints

### n8n Webhook URLs

- **Production:** `https://n8n.yourapp.com/webhook/recipe-generate`
- **Testing:** `https://n8n-staging.yourapp.com/webhook/recipe-generate`
- **Development:** `http://localhost:5678/webhook/recipe-generate`

### Monitoring & Analytics

- Recipe generation success rate
- AI response time metrics
- User satisfaction scores
- Popular ingredient combinations

## 🛠️ Development Setup

### n8n Local Installation

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# Access n8n editor
# http://localhost:5678
```

### Workflow Import/Export

```bash
# Export workflow
n8n export:workflow --id=1 --output=recipe-generation.json

# Import workflow
n8n import:workflow --input=recipe-generation.json
```

## 🔐 Security Considerations

### API Key Management

- Rotate AI API keys monthly
- Use environment variables for sensitive data
- Implement rate limiting on AI endpoints
- Monitor API usage and costs

### Data Privacy

- Don't log sensitive user data
- Implement data retention policies
- Ensure GDPR compliance
- Secure webhook endpoints

## 📈 Performance Optimization

### Caching Strategy

```javascript
// Cache popular recipes
const cacheKey = `recipe:${ingredientHash}:${preferencesHash}`;
const cachedRecipe = await redis.get(cacheKey);

if (cachedRecipe) {
  return JSON.parse(cachedRecipe);
}
```

### Batch Processing

- Group similar requests
- Implement request queuing
- Optimize AI prompt engineering
- Use streaming responses where possible

## 🧪 Testing Framework

### Unit Tests

```javascript
// Test ingredient processing
describe("Ingredient Processing", () => {
  test("should normalize ingredient names", () => {
    const input = ["Chicken Breast", "RICE", "tomato"];
    const expected = ["chicken breast", "rice", "tomato"];
    expect(normalizeIngredients(input)).toEqual(expected);
  });
});
```

### Integration Tests

```javascript
// Test full workflow
describe("Recipe Generation Workflow", () => {
  test("should generate valid recipe from ingredients", async () => {
    const input = {
      ingredients: ["chicken", "rice", "vegetables"],
      preferences: ["gluten-free"],
    };

    const result = await generateRecipe(input);
    expect(result.success).toBe(true);
    expect(result.recipe.title).toBeDefined();
    expect(result.recipe.ingredients.length).toBeGreaterThan(0);
  });
});
```

## 📋 Deployment Checklist

- [ ] n8n workflow tested and validated
- [ ] AI API keys configured
- [ ] Webhook URLs updated
- [ ] Error handling implemented
- [ ] Performance monitoring setup
- [ ] Security review completed
- [ ] Documentation updated

---

**Status:** 📅 Scheduled for Day 22-24
**Dependencies:** Backend API (Day 18-21)
**Next Steps:** AI model integration and testing
