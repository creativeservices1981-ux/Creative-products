const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function addSlugColumn() {
  try {
    console.log('Adding slug column to products table...')
    
    // First, fetch all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title')
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError)
      return
    }
    
    console.log(`Found ${products.length} products`)
    
    // Update each product with a slug
    for (const product of products) {
      const slug = generateSlug(product.title)
      console.log(`Updating product "${product.title}" with slug: ${slug}`)
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ slug })
        .eq('id', product.id)
      
      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError)
      }
    }
    
    console.log('✅ Successfully added slugs to all products!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

addSlugColumn()
