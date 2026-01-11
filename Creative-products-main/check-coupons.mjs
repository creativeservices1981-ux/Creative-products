import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxqzeiisfaidhqweiqij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXplaWlzZmFpZGhxd2VpcWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0OTI3NywiZXhwIjoyMDgyOTI1Mjc3fQ.zHHiFUp04fRc6jtQ0f_lDo0aS6oDVTCdw7-HqePqeXg'
)

const { data, error } = await supabase.from('coupons').select('*').limit(1)

if (error) {
  console.log('Table status:', error.code === 'PGRST205' ? 'NOT EXISTS' : error.message)
} else {
  console.log('Table EXISTS! Data:', data)
}
