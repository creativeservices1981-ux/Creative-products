-- Coupons System Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER, -- NULL means unlimited
    uses_count INTEGER DEFAULT 0,
    one_time_per_user BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE, -- Show on homepage
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon usage tracking table
CREATE TABLE IF NOT EXISTS coupon_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coupon_id, user_id, order_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON coupon_usages(coupon_id);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
CREATE POLICY "Anyone can view active coupons"
    ON coupons FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can do everything with coupons"
    ON coupons FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policies for coupon_usages
CREATE POLICY "Users can view their own coupon usage"
    ON coupon_usages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage"
    ON coupon_usages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all coupon usages"
    ON coupon_usages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Update trigger for coupons
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE coupons IS 'Discount coupons for digital products';
COMMENT ON TABLE coupon_usages IS 'Track coupon usage per user';
