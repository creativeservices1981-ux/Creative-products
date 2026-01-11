// Script to create coupons table via Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})

async function createCouponsTable() {
  console.log('Attempting to create coupons table...')
  
  // Try using the SQL query via fetch to the Supabase SQL endpoint
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
  
  const sql = `
    -- Create coupons table
    CREATE TABLE IF NOT EXISTS coupons (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10, 2) NOT NULL,
        min_order_amount DECIMAL(10, 2) DEFAULT 0,
        max_uses INTEGER,
        uses_count INTEGER DEFAULT 0,
        one_time_per_user BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create coupon_usages table
    CREATE TABLE IF NOT EXISTS coupon_usages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
        used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
    CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);

    -- Enable RLS
    ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
    ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;

    -- Policies for coupons
    DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
    CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true);
    
    DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
    CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    );

    -- Policies for coupon_usages  
    DROP POLICY IF EXISTS "Users can view own usage" ON coupon_usages;
    CREATE POLICY "Users can view own usage" ON coupon_usages FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can insert own usage" ON coupon_usages;
    CREATE POLICY "Users can insert own usage" ON coupon_usages FOR INSERT WITH CHECK (auth.uid() = user_id);
  `

  // Try using the Supabase query endpoint  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    })
    
    if (response.ok) {
      console.log('✅ Table created via RPC!')
      return true
    }
  } catch (e) {
    console.log('RPC method not available, trying alternative...')
  }

  // Alternative: Try the query endpoint
  try {
    const response = await fetch(`${supabaseUrl}/pg/query`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    })
    
    if (response.ok) {
      console.log('✅ Table created via query endpoint!')
      return true
    }
  } catch (e) {
    console.log('Query endpoint not available')
  }

  return false
}

createCouponsTable().then(success => {
  if (!success) {
    console.log('\n❌ Could not create table automatically.')
    console.log('Please run the SQL manually in Supabase Dashboard.')
  }
})
