-- Add Favorites/Wishlist Feature
-- Run this in Supabase SQL Editor

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

COMMENT ON TABLE favorites IS 'User favorite/wishlist products';
