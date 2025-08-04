-- Supabase Database Schema for Recipe Generator
-- This file contains the SQL commands to set up the PostgreSQL database in Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    dietary_preferences JSONB DEFAULT '[]'::jsonb,
    cooking_skill VARCHAR(20) CHECK (cooking_skill IN ('beginner', 'intermediate', 'advanced')),
    favorite_cuisines JSONB DEFAULT '[]'::jsonb
);

-- User sessions table (for magic link authentication)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Magic link tokens table
CREATE TABLE IF NOT EXISTS magic_link_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe favorites/bookmarks (references to MongoDB recipes)
CREATE TABLE IF NOT EXISTS recipe_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    recipe_id VARCHAR(100) NOT NULL, -- MongoDB ObjectId as string
    bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
    personal_notes TEXT,
    UNIQUE(user_id, recipe_id)
);

-- Recipe generation history
CREATE TABLE IF NOT EXISTS recipe_generation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    ingredients JSONB NOT NULL,
    dietary_preferences JSONB,
    cuisine_preference VARCHAR(50),
    difficulty_preference VARCHAR(20),
    generated_recipe_ids JSONB, -- Array of MongoDB recipe IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_email ON magic_link_tokens(email);
CREATE INDEX IF NOT EXISTS idx_recipe_bookmarks_user_id ON recipe_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_generation_history_user_id ON recipe_generation_history(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for recipe_bookmarks
CREATE POLICY "Users can view own bookmarks" ON recipe_bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for recipe_generation_history
CREATE POLICY "Users can view own generation history" ON recipe_generation_history
    FOR ALL USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired tokens and sessions
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM magic_link_tokens WHERE expires_at < NOW();
    DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Sample data (optional - for development)
-- INSERT INTO user_profiles (email, cooking_skill, dietary_preferences, favorite_cuisines)
-- VALUES 
--     ('demo@example.com', 'intermediate', '["vegetarian"]', '["italian", "asian"]'),
--     ('test@example.com', 'beginner', '["vegan", "gluten-free"]', '["mexican", "american"]');

-- Grant permissions (adjust as needed for your Supabase setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
