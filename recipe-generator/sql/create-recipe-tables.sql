-- Recipe Tables for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Recipe Bookmarks Table
CREATE TABLE IF NOT EXISTS recipe_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    recipe_id TEXT NOT NULL,
    recipe_title TEXT NOT NULL,
    recipe_data JSONB NOT NULL,
    bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Generation History Table
CREATE TABLE IF NOT EXISTS recipe_generation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    recipe_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE recipe_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipe_bookmarks
CREATE POLICY "Users can view their own bookmarks" ON recipe_bookmarks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON recipe_bookmarks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON recipe_bookmarks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all bookmarks" ON recipe_bookmarks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for recipe_generation_history
CREATE POLICY "Users can view their own history" ON recipe_generation_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history" ON recipe_generation_history
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all history" ON recipe_generation_history
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipe_bookmarks_user_id ON recipe_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_bookmarks_recipe_id ON recipe_bookmarks(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_bookmarks_bookmarked_at ON recipe_bookmarks(bookmarked_at);

CREATE INDEX IF NOT EXISTS idx_recipe_generation_history_user_id ON recipe_generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_generation_history_created_at ON recipe_generation_history(created_at);
