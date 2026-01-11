// Script to create coupons table in Supabase
// Run with: node setup-coupons.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupCoupons() {
  console.log('Setting up coupons tables...')
  
  // Create coupons table using raw SQL via RPC
  const createCouponsSQL = `
    -- Create coupons table if not exists
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

    -- Create coupon_usages table if not exists
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
    CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);
    CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON coupon_usages(coupon_id);
  `

  // Try to execute via SQL - this requires the SQL functions to be enabled
  // Since we can't run raw SQL directly, let's try inserting a test record
  
  // First check if table exists by trying to query it
  const { data: existingCoupons, error: checkError } = await supabase
    .from('coupons')
    .select('id')
    .limit(1)

  if (checkError && checkError.code === 'PGRST205') {
    console.log('\n⚠️  The coupons table does not exist yet.')
    console.log('\n📋 Please run the following SQL in your Supabase SQL Editor:')
    console.log('   Go to: https://supabase.com/dashboard → Your Project → SQL Editor')
    console.log('\n' + '='.repeat(60))
    console.log(`
-- Coupons System Database Schema

-- Coupons table
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

-- Coupon usage tracking table
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
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON coupon_usages(coupon_id);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can do everything with coupons" ON coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
);

-- RLS Policies for coupon_usages
CREATE POLICY "Users can view their own coupon usage" ON coupon_usages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own coupon usage" ON coupon_usages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all coupon usages" ON coupon_usages FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
);

-- Update trigger for coupons
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`)
    console.log('='.repeat(60))
    console.log('\n✅ After running the SQL, you can create coupons from the Admin Dashboard!')
    return
  }

  if (checkError) {
    console.error('Error checking coupons table:', checkError)
    return
  }

  console.log('✅ Coupons table already exists!')
  console.log(`   Found ${existingCoupons?.length || 0} coupons`)

  // Create a sample coupon if none exist
  if (!existingCoupons || existingCoupons.length === 0) {
    console.log('\n📦 Creating sample coupons...')
    
    const sampleCoupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome! Get 10% off your first purchase',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 100,
        one_time_per_user: true,
        is_featured: true,
        is_active: true
      },
      {
        code: 'FLAT50',
        description: 'Flat ₹50 off on orders above ₹500',
        discount_type: 'fixed',
        discount_value: 50,
        min_order_amount: 500,
        max_uses: 100,
        is_featured: true,
        is_active: true
      }
    ]

    for (const coupon of sampleCoupons) {
      const { data, error } = await supabase
        .from('coupons')
        .insert(coupon)
        .select()

      if (error) {
        console.error(`   ❌ Failed to create ${coupon.code}:`, error.message)
      } else {
        console.log(`   ✅ Created coupon: ${coupon.code}`)
      }
    }
  }

  console.log('\n🎉 Setup complete!')
}

setupCoupons().catch(console.error)
