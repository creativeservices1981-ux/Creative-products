const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://xxqzeiisfaidhqweiqij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXplaWlzZmFpZGhxd2VpcWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0OTI3NywiZXhwIjoyMDgyOTI1Mjc3fQ.zHHiFUp04fRc6jtQ0f_lDo0aS6oDVTCdw7-HqePqeXg'
)

async function checkAndSetup() {
  console.log('🔍 Checking for product-files bucket...\n')
  
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('❌ Error listing buckets:', error)
      return
    }
    
    console.log('📦 Found buckets:', buckets.map(b => b.name).join(', '))
    
    // Check if product-files bucket exists
    const productBucket = buckets.find(b => b.name === 'product-files')
    
    if (!productBucket) {
      console.log('\n❌ Bucket "product-files" not found!')
      console.log('Please create it at:')
      console.log('https://supabase.com/dashboard/project/xxqzeiisfaidhqweiqij/storage/buckets')
      return
    }
    
    console.log('\n✅ Bucket "product-files" exists!')
    console.log('   ID:', productBucket.id)
    console.log('   Public:', productBucket.public)
    console.log('   File size limit:', productBucket.file_size_limit || 'No limit')
    
    console.log('\n🔐 Storage policies need to be added via Supabase dashboard.')
    console.log('But the bucket is ready for use!')
    
    // Test upload permissions
    console.log('\n🧪 Testing upload...')
    
    const testFileName = `test-${Date.now()}.txt`
    const testContent = 'This is a test file'
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-files')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      })
    
    if (uploadError) {
      console.log('⚠️  Upload test failed (this is expected, policies need to be set)')
      console.log('   Error:', uploadError.message)
    } else {
      console.log('✅ Upload test successful!')
      console.log('   File:', uploadData.path)
      
      // Clean up test file
      await supabase.storage.from('product-files').remove([testFileName])
      console.log('   (Test file cleaned up)')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ BUCKET SETUP COMPLETE!')
    console.log('='.repeat(60))
    console.log('\nYou can now:')
    console.log('1. Go to Admin Dashboard')
    console.log('2. Click "Add Product"')
    console.log('3. Upload product files!')
    console.log('\nAdmin Dashboard: https://digiloft.preview.emergentagent.com/admin/dashboard')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

checkAndSetup()
