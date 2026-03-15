const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kazyjjgiwrffzznadjyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthenlqamdpd3JmZnp6bmFkanl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDIyMTcsImV4cCI6MjA4OTAxODIxN30.kaP-VhAyWkfGDScJ774boKDipCJ7EJXUmLIzjNJ4ZAM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabaseStorage() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error fetching buckets:', error);
  } else {
    console.log('Buckets:', data);
  }
}

testSupabaseStorage();
