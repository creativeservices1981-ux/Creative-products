// Try using fetch to execute SQL via Supabase internal endpoint
const SUPABASE_URL = 'https://xxqzeiisfaidhqweiqij.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXplaWlzZmFpZGhxd2VpcWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0OTI3NywiZXhwIjoyMDgyOTI1Mjc3fQ.zHHiFUp04fRc6jtQ0f_lDo0aS6oDVTCdw7-HqePqeXg'

const sql = `
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
`

async function tryEndpoints() {
  const endpoints = [
    '/rest/v1/rpc/exec_sql',
    '/pg/query', 
    '/query',
    '/sql',
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying ${endpoint}...`)
      const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({ query: sql, sql: sql })
      })
      
      const text = await response.text()
      console.log(`Status: ${response.status}`)
      if (response.ok) {
        console.log('Success!')
        return true
      }
    } catch (e) {
      console.log(`Error: ${e.message}`)
    }
  }
  return false
}

tryEndpoints()
