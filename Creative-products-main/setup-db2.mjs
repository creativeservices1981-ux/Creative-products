import postgres from 'postgres'

// Try direct connection (port 5432)
const sql = postgres({
  host: 'db.xxqzeiisfaidhqweiqij.supabase.co',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'sJypCxGlF8bOcSJY',
  ssl: { rejectUnauthorized: false }
})

async function createTables() {
  try {
    console.log('Connecting to database (direct)...')
    
    const result = await sql`SELECT 1 as test`
    console.log('Connected!', result)
    
  } catch (error) {
    console.error('Connection error:', error.message)
  } finally {
    await sql.end()
  }
}

createTables()
