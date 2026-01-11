import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxqzeiisfaidhqweiqij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXplaWlzZmFpZGhxd2VpcWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0OTI3NywiZXhwIjoyMDgyOTI1Mjc3fQ.zHHiFUp04fRc6jtQ0f_lDo0aS6oDVTCdw7-HqePqeXg'
)

// Check existing coupons
const { data: existingCoupons, error: checkError } = await supabase
  .from('coupons')
  .select('*')

console.log('Existing coupons:', existingCoupons?.length || 0)
if (existingCoupons) {
  existingCoupons.forEach(c => console.log(`  - ${c.code}: is_active=${c.is_active}, is_featured=${c.is_featured}`))
}

// Add/Update sample coupons with is_featured = true
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
    is_featured: true,
    is_active: true
  },
  {
    code: 'SAVE20',
    description: 'Save 20% on all digital products',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_amount: 200,
    is_featured: true,
    is_active: true
  }
]

for (const coupon of sampleCoupons) {
  const { data, error } = await supabase
    .from('coupons')
    .upsert(coupon, { onConflict: 'code' })
    .select()
  
  if (error) {
    console.log(`Error with ${coupon.code}:`, error.message)
  } else {
    console.log(`✅ Coupon ${coupon.code} added/updated`)
  }
}

// Verify coupons are now visible
const { data: finalCoupons } = await supabase
  .from('coupons')
  .select('*')
  .eq('is_active', true)
  .eq('is_featured', true)

console.log('\nFeatured active coupons:', finalCoupons?.length || 0)
