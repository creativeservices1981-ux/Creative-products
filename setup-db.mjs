import postgres from 'postgres'

const sql = postgres({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  username: 'postgres.xxqzeiisfaidhqweiqij',
  password: 'sJypCxGlF8bOcSJY',
  ssl: 'require'
})

async function createTables() {
  try {
    console.log('Connecting to database...')
    
    // Create coupons table
    await sql`
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
      )
    `
    console.log('✅ Coupons table created!')

    // Create coupon_usages table
    await sql`
      CREATE TABLE IF NOT EXISTS coupon_usages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
        used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log('✅ Coupon usages table created!')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`
    await sql`CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active)`
    console.log('✅ Indexes created!')

    // Enable RLS
    await sql`ALTER TABLE coupons ENABLE ROW LEVEL SECURITY`
    await sql`ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY`
    console.log('✅ RLS enabled!')

    // Create policies
    await sql`DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons`
    await sql`CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true)`
    
    await sql`DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons`
    await sql`CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (
      EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
    )`
    console.log('✅ Policies created!')

    // Insert sample coupons
    await sql`
      INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, one_time_per_user, is_featured, is_active)
      VALUES 
        ('WELCOME10', 'Welcome! Get 10% off your first purchase', 'percentage', 10, 100, true, true, true),
        ('FLAT50', 'Flat ₹50 off on orders above ₹500', 'fixed', 50, 500, false, true, true)
      ON CONFLICT (code) DO NOTHING
    `
    console.log('✅ Sample coupons created!')

    console.log('\n🎉 All done! Coupons system is ready!')
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await sql.end()
  }
}

createTables()
