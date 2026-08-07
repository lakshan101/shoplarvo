const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('⚡ Supabase Client initialized successfully.');

module.exports = supabase;
