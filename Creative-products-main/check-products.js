const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://xxqzeiisfaidhqweiqij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXplaWlzZmFpZGhxd2VpcWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0OTI3NywiZXhwIjoyMDgyOTI1Mjc3fQ.zHHiFUp04fRc6jtQ0f_lDo0aS6oDVTCdw7-HqePqeXg'
)

async function checkProducts() {
  const { data, error, count } = await supabase
    .from('products')
    .select('id, title, status', { count: 'exact' })
    .eq('status', 'active')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log(`Total products: ${count}`)
    console.log('Products:', data)
  }
}

checkProducts()
