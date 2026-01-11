const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://xxqzeiisfaidhqweiqij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXplaWlzZmFpZGhxd2VpcWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0OTI3NywiZXhwIjoyMDgyOTI1Mjc3fQ.zHHiFUp04fRc6jtQ0f_lDo0aS6oDVTCdw7-HqePqeXg'
)

async function makeAdmin() {
  const email = 'ashishbhattb@gmail.com'
  
  console.log(`Making ${email} an admin...`)
  
  try {
    // First, check if user exists
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error listing users:', authError)
      return
    }
    
    const user = authUsers.users.find(u => u.email === email)
    
    if (!user) {
      console.log('❌ User not found. Please sign up first at:')
      console.log('   https://digiloft.preview.emergentagent.com/signup')
      return
    }
    
    console.log('✅ User found:', user.id)
    
    // Update user profile to admin
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('id', user.id)
      .select()
    
    if (error) {
      console.error('❌ Error updating profile:', error)
      return
    }
    
    console.log('✅ Successfully made admin!')
    console.log('📧 Email:', email)
    console.log('🆔 User ID:', user.id)
    console.log('')
    console.log('Next steps:')
    console.log('1. Logout if you are logged in')
    console.log('2. Login again at: https://digiloft.preview.emergentagent.com/login')
    console.log('3. You will see "Admin Dashboard" button in the header!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

makeAdmin()
