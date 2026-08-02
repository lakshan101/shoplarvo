const supabase = require('../config/supabase');

async function testConnection() {
  console.log('Testing connection to Supabase project...');
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.log('Supabase Response (Table query):', error.message);
    } else {
      console.log('✅ Connected successfully to Supabase! Data:', data);
    }
  } catch (err) {
    console.error('Connection test error:', err);
  }
}

testConnection();
