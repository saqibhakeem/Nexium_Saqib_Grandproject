# Recipe Generator Deployment Guide

## Overview

Complete deployment guide for the AI-powered Recipe Generator application with Supabase, MongoDB, n8n workflows, and Vercel.

## Prerequisites

- Vercel account
- Supabase account
- MongoDB Atlas account (or other MongoDB provider)
- n8n instance (self-hosted or cloud)
- OpenAI API key
- Anthropic API key (optional)

## Step 1: Database Setup

### Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create required tables:

```sql
-- Users table (handled by Supabase Auth)
-- User sessions table
CREATE TABLE user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dietary_restrictions TEXT[] DEFAULT '{}',
    favorite_cuisines TEXT[] DEFAULT '{}',
    skill_level TEXT DEFAULT 'beginner',
    cooking_time_preference TEXT DEFAULT '30 minutes',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe generation history
CREATE TABLE recipe_generation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ingredients TEXT[] NOT NULL,
    dietary_preferences TEXT[] DEFAULT '{}',
    cuisine_preference TEXT,
    difficulty_preference TEXT,
    generated_recipe_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved recipes table
CREATE TABLE saved_recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id TEXT NOT NULL,
    recipe_title TEXT NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON user_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON user_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own history" ON recipe_generation_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON recipe_generation_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own saved recipes" ON saved_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved recipes" ON saved_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved recipes" ON saved_recipes FOR DELETE USING (auth.uid() = user_id);
```

3. Configure authentication:
   - Enable email authentication
   - Set up magic link templates
   - Configure redirect URLs

### MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Create a database named `recipe_generator`
3. Create collections:
   - `recipes` - for storing generated recipes
   - `ingredients` - for ingredient suggestions
   - `nutrition_data` - for nutritional information

## Step 2: n8n Workflow Setup

### n8n Installation

1. Deploy n8n instance (Docker/cloud)
2. Import the workflow from `ai/workflows/recipe-generation.json`
3. Configure credentials:
   - OpenAI API credentials
   - Anthropic API credentials
   - HTTP Header Auth for internal API

### Workflow Configuration

1. Set environment variables:

   ```
   PREFERRED_AI_PROVIDER=openai
   OPENAI_API_KEY=your_key
   ANTHROPIC_API_KEY=your_key
   APP_BASE_URL=https://your-app.vercel.app
   INTERNAL_API_KEY=secure_random_key
   ```

2. Test the workflow:
   - Send POST request to webhook endpoint
   - Verify AI response processing
   - Check database integration

## Step 3: Vercel Deployment

### Environment Variables

Configure in Vercel dashboard:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_DB_NAME=recipe_generator

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/recipe-generate
PREFERRED_AI_PROVIDER=openai

# Security
INTERNAL_API_KEY=secure_random_key_matching_n8n
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Deployment Steps

1. Connect GitHub repository to Vercel
2. Configure build settings:

   - Framework: Next.js
   - Node.js version: 18.x
   - Build command: `npm run build`
   - Output directory: `.next`

3. Deploy and test:
   ```bash
   npm run build
   npm run start
   ```

## Step 4: Testing & Validation

### API Testing

Test all endpoints:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Authentication
curl -X POST https://your-app.vercel.app/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Recipe generation
curl -X POST https://your-app.vercel.app/api/recipes/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: session-token=your_token" \
  -d '{"ingredients": ["chicken", "rice"], "cuisine_preference": "asian"}'
```

### AI Integration Testing

1. Test direct AI service:

   ```bash
   # Test n8n webhook
   curl -X POST https://your-n8n.com/webhook/recipe-generate \
     -H "Content-Type: application/json" \
     -d '{"ingredients": ["tomato", "pasta"], "cuisine_preference": "italian"}'
   ```

2. Verify fallback mechanisms work
3. Test both OpenAI and Anthropic providers

### Frontend Testing

1. User registration/login flow
2. Recipe generation interface
3. Recipe saving/unsaving
4. User profile management
5. Responsive design on mobile/desktop

## Step 5: Monitoring & Maintenance

### Error Monitoring

- Set up Vercel Analytics
- Monitor API response times
- Track AI generation success rates
- Set up alerts for failures

### Performance Optimization

- Enable Vercel Edge Functions for faster response
- Implement caching for frequently generated recipes
- Optimize database queries
- Use CDN for static assets

### Backup Strategy

- Automated MongoDB backups
- Supabase automated backups
- Regular n8n workflow exports
- Code repository backups

## Troubleshooting

### Common Issues

1. **AI API Rate Limits**: Implement proper rate limiting and fallbacks
2. **Database Connection**: Check connection strings and network access
3. **Authentication Issues**: Verify Supabase configuration and RLS policies
4. **n8n Webhook Failures**: Check authentication and network connectivity

### Debug Commands

```bash
# Check build logs
vercel logs

# Test database connection
node -e "require('./api/database/mongodb').connectToDatabase().then(() => console.log('Connected'))"

# Verify environment variables
vercel env ls
```

## Security Checklist

- [ ] All API keys stored securely
- [ ] RLS policies enabled on Supabase
- [ ] Internal API key for n8n integration
- [ ] HTTPS enforced everywhere
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive data

## Go Live Checklist

- [ ] All environment variables configured
- [ ] Database schemas created
- [ ] n8n workflow imported and tested
- [ ] AI providers tested with real requests
- [ ] Frontend tested on multiple devices
- [ ] Authentication flow working
- [ ] Recipe generation working end-to-end
- [ ] Error handling tested
- [ ] Performance monitoring setup
- [ ] Backup systems in place

## Post-Launch Tasks

1. Monitor usage patterns
2. Optimize AI prompts based on user feedback
3. Add more recipe categories
4. Implement user analytics
5. Scale infrastructure as needed

## Support & Maintenance

- Monitor API quotas and usage
- Regular security updates
- Database maintenance
- AI model updates
- User feedback integration

---

For technical support or questions, refer to the project documentation or contact the development team.
