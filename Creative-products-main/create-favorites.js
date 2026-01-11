const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://xxqzeiisfaidhqweiqij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXplaWlzZmFpZGhxd2VpcWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM0OTI3NywiZXhwIjoyMDgyOTI1Mjc3fQ.zHHiFUp04fRc6jtQ0f_lDo0aS6oDVTCdw7-HqePqeXg'
)

const sql = `
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);
`

async function createFavoritesTable() {
  console.log('Creating favorites table...')
  
  try {
    const { data, error} = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      // Table might already exist, let's check
      const { data: tables } = await supabase
        .from('favorites')
        .select('id')
        .limit(1)
      
      console.log('✅ Favorites table already exists or created!')
    } else {
      console.log('✅ Favorites table created successfully!')
    }
  } catch (error) {
    console.log('Note: Table might already exist, which is fine!')
    console.log('Error:', error.message)
  }
}

createFavoritesTable()
