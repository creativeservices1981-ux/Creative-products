const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const dummyProducts = [
  {
    title: 'Social Media Reels Pack - Vol 1',
    description: 'Complete collection of 50+ viral-ready Instagram and TikTok reels templates. Includes trending transitions, effects, and music sync templates. Perfect for content creators and influencers.',
    price: 999.00,
    delivery_type: 'file_download',
    storage_path: 'https://example.com/reels-pack-vol1.zip',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=500&fit=crop',
    access_expiry_hours: null,
    download_limit: 5
  },
  {
    title: 'Canva Template Bundle - Business',
    description: '100+ professionally designed Canva templates for businesses. Includes social media posts, presentations, flyers, and branding materials. Fully customizable and easy to edit.',
    price: 1499.00,
    delivery_type: 'google_drive_link',
    storage_path: 'https://drive.google.com/drive/folders/example-business-templates',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
    access_expiry_hours: 168,
    download_limit: null
  },
  {
    title: 'Ultimate Caption & Hashtag Pack',
    description: '500+ ready-to-use captions and 1000+ trending hashtags organized by niche. Perfect for Instagram, Facebook, and LinkedIn. Includes seasonal content and engagement-boosting formulas.',
    price: 599.00,
    delivery_type: 'file_download',
    storage_path: 'https://example.com/captions-hashtags.pdf',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=500&h=500&fit=crop',
    access_expiry_hours: null,
    download_limit: 3
  },
  {
    title: 'Entrepreneur Database - 10K Contacts',
    description: 'Verified database of 10,000+ entrepreneur contacts with email addresses, business info, and social profiles. Perfect for B2B outreach and networking. Updated monthly.',
    price: 2999.00,
    delivery_type: 'file_download',
    storage_path: 'https://example.com/entrepreneur-database.xlsx',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop',
    access_expiry_hours: 72,
    download_limit: 1
  },
  {
    title: 'Complete SOP Template Pack',
    description: '50+ Standard Operating Procedure templates for various business processes. Includes HR, Sales, Marketing, and Operations SOPs. Fully editable in Word and Google Docs.',
    price: 1299.00,
    delivery_type: 'folder',
    storage_path: 'https://example.com/sop-templates-folder',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=500&fit=crop',
    access_expiry_hours: null,
    download_limit: null
  },
  {
    title: 'Video Editing Course - Beginner to Pro',
    description: 'Complete video editing masterclass with lifetime access. Learn Adobe Premiere Pro, DaVinci Resolve, and mobile editing. 20+ hours of content with project files.',
    price: 3999.00,
    delivery_type: 'external_url',
    storage_path: 'https://courses.example.com/video-editing-pro',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=500&fit=crop',
    access_expiry_hours: null,
    download_limit: null
  },
  {
    title: 'ChatGPT Prompt Library - 500+ Prompts',
    description: 'Massive collection of tested ChatGPT prompts for business, content creation, coding, and productivity. Organized by category with usage examples and templates.',
    price: 799.00,
    delivery_type: 'file_download',
    storage_path: 'https://example.com/chatgpt-prompts.pdf',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=500&fit=crop',
    access_expiry_hours: null,
    download_limit: 10
  },
  {
    title: 'Stock Photo Bundle - 1000+ Images',
    description: 'Premium royalty-free stock photos for commercial use. High-resolution images covering business, lifestyle, technology, and nature. Perfect for websites and marketing.',
    price: 1999.00,
    delivery_type: 'google_drive_link',
    storage_path: 'https://drive.google.com/drive/folders/example-stock-photos',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=500&h=500&fit=crop',
    access_expiry_hours: null,
    download_limit: 5
  },
  {
    title: 'Social Media Growth Toolkit',
    description: 'Complete toolkit for growing your social media presence. Includes scheduling templates, growth strategies, analytics spreadsheets, and engagement tactics. For all major platforms.',
    price: 899.00,
    delivery_type: 'file_download',
    storage_path: 'https://example.com/social-growth-toolkit.zip',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=500&h=500&fit=crop',
    access_expiry_hours: 24,
    download_limit: 3
  }
]

async function seedProducts() {
  console.log('Starting to seed products...')
  
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(dummyProducts)
      .select()

    if (error) throw error

    console.log(`✅ Successfully inserted ${data.length} products!`)
    console.log('Products:', data.map(p => p.title))
  } catch (error) {
    console.error('❌ Error seeding products:', error.message)
  }
}

seedProducts()
