# API Documentation

# Recipe Generator Backend

## 🚀 Quick Start

This directory contains the backend API setup and database configurations for the Recipe Generator application.

## 📋 API Endpoints

### Authentication

- ✅ `POST /api/auth/magic-link` - Send magic link to user's email
- ✅ `GET /api/auth/verify` - Verify magic link token
- ✅ `POST /api/auth/logout` - Logout user session

### Recipes

- ✅ `POST /api/recipes/generate` - Generate new recipes based on ingredients
- ✅ `GET /api/recipes/saved` - Get user's saved recipes
- ✅ `POST /api/recipes/save` - Save a recipe to user's collection
- ✅ `DELETE /api/recipes/save?recipe_id={id}` - Remove recipe from saved collection

### User Management

- ✅ `GET /api/user/profile` - Get user profile
- ✅ `PUT /api/user/preferences` - Update dietary preferences
- ✅ `GET /api/user/preferences` - Get user preferences

## 🗄️ Database Setup

### Supabase Configuration

- ✅ PostgreSQL database for user management
- ✅ Real-time subscriptions for live updates
- ✅ Row Level Security (RLS) for data protection
- ✅ Magic link authentication system
- ✅ User sessions and preferences

### MongoDB Configuration

- ✅ Recipe storage and caching
- ✅ Recipe metadata and ratings
- ✅ Search optimization
- ✅ AI-generated recipe management

## 📦 Dependencies

```json
{
  "@supabase/supabase-js": "^2.0.0",
  "mongodb": "^6.0.0"
}
```

## 🔧 Database Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `api/database/schemas.sql`
3. Configure Row Level Security policies
4. Get your project URL and anon key

### 2. MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Create a database named `recipe_generator`
3. Collections will be created automatically:
   - `recipes` - AI-generated and user recipes
   - `saved_recipes` - User bookmarks

### 3. Environment Variables

Update your `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=recipe_generator
```

## 📝 API Usage Examples

### Send Magic Link

```bash
curl -X POST http://localhost:3000/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Generate Recipes

```bash
curl -X POST http://localhost:3000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "rice", "tomatoes"],
    "dietary_preferences": ["gluten-free"],
    "cuisine_preference": "asian",
    "difficulty_preference": "easy"
  }'
```

### Save Recipe

```bash
curl -X POST http://localhost:3000/api/recipes/save \
  -H "Content-Type: application/json" \
  -H "Cookie: session-token=your_session_token" \
  -d '{
    "recipe_id": "recipe_mongodb_id",
    "personal_rating": 5,
    "personal_notes": "Delicious!"
  }'
```

## 🔒 Authentication Flow

1. User enters email on frontend
2. Backend generates magic link token
3. Email sent with magic link (currently logged for development)
4. User clicks link → `/api/auth/verify?token=...`
5. Backend validates token and creates session
6. Session cookie set for authenticated requests
7. Subsequent API calls use session cookie for auth

## 🏗️ Project Structure

```
api/
├── auth/
│   └── middleware.ts          # Authentication utilities
├── database/
│   ├── supabase.ts           # Supabase client & helpers
│   ├── mongodb.ts            # MongoDB client & operations
│   └── schemas.sql           # Database schema
└── README.md                 # This file
```

## ✅ Implementation Status

- [x] **Authentication System** - Magic link auth with sessions
- [x] **Database Layer** - Supabase + MongoDB integration
- [x] **Recipe Generation** - AI recipe creation (mock data)
- [x] **User Management** - Profiles and preferences
- [x] **Recipe Management** - Save/unsave recipes
- [ ] **AI Integration** - n8n workflow (next phase)
- [ ] **Email Service** - Magic link delivery
- [ ] **Rate Limiting** - API protection
- [ ] **Error Handling** - Comprehensive error responses

## 📈 Next Steps (Phase 4: AI Integration)

1. Set up n8n workflow for recipe generation
2. Integrate OpenAI/Anthropic APIs
3. Implement email service for magic links
4. Add rate limiting and monitoring
5. Performance optimization

---

**Status:** ✅ Phase 2 Complete - Ready for Frontend Integration  
**Next:** Phase 3 - Frontend UI Development
"bcryptjs": "^2.4.3",
"jsonwebtoken": "^9.0.0",
"nodemailer": "^6.9.0"
}

````

## 🔒 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=recipe_generator

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# JWT
JWT_SECRET=your_jwt_secret
MAGIC_LINK_SECRET=your_magic_link_secret

# n8n Webhook
N8N_WEBHOOK_URL=your_n8n_webhook_url
N8N_API_KEY=your_n8n_api_key
````

---

**Status:** 📅 Scheduled for Day 18
**Next Steps:** Database schema implementation
