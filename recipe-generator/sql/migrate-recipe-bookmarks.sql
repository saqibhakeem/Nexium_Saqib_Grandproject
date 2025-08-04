-- Migration to add missing columns to recipe_bookmarks table
-- Run this in your Supabase SQL Editor

-- Add personal_notes column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'recipe_bookmarks' 
                   AND column_name = 'personal_notes') THEN
        ALTER TABLE recipe_bookmarks ADD COLUMN personal_notes TEXT;
    END IF;
END $$;

-- Add personal_rating column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'recipe_bookmarks' 
                   AND column_name = 'personal_rating') THEN
        ALTER TABLE recipe_bookmarks ADD COLUMN personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5);
    END IF;
END $$;

-- Update the table structure to match the expected schema
-- (This will only modify if the columns don't already exist)

-- Ensure we have all the expected columns
DO $$ 
BEGIN
    -- Check if recipe_title column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'recipe_bookmarks' 
                   AND column_name = 'recipe_title') THEN
        ALTER TABLE recipe_bookmarks ADD COLUMN recipe_title TEXT;
    END IF;
    
    -- Check if recipe_data column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'recipe_bookmarks' 
                   AND column_name = 'recipe_data') THEN
        ALTER TABLE recipe_bookmarks ADD COLUMN recipe_data JSONB;
    END IF;
END $$;

-- Show the current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'recipe_bookmarks' 
ORDER BY ordinal_position;
