const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

async function seedSupabase() {
  console.log('🌱 Seeding sample data to your live Supabase project...');

  try {
    // 1. Seed Categories
    const categoriesData = [
      { name: 'Women Fashion', slug: 'women-fashion', description: 'Luxury women apparel' },
      { name: 'Men Fashion', slug: 'men-fashion', description: 'Executive men clothing' },
      { name: 'Streetwear & Hoodies', slug: 'streetwear-hoodies', description: 'Modern streetwear collection' },
      { name: 'Suits & Tailoring', slug: 'suits-tailoring', description: 'Bespoke suits and coats' },
      { name: 'Footwear', slug: 'footwear', description: 'Designer sneakers and boots' },
      { name: 'Luxury Accessories', slug: 'luxury-accessories', description: 'Bags, watches and jewelry' }
    ];

    const { error: catErr } = await supabase.from('categories').upsert(categoriesData, { onConflict: 'name' });
    if (catErr) console.log('Category seed note:', catErr.message);
    else console.log('✅ Categories seeded to Supabase.');

    // 2. Seed Users
    const passwordHash = bcrypt.hashSync('SarahStyle#2026', 10);
    const adminHash = bcrypt.hashSync('AdminStyle#2026', 10);

    const usersData = [
      {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        password: passwordHash,
        role: 'customer',
        phone: '+94 70 555 1212',
        secondary_phone: '+94 11 555 9999'
      },
      {
        name: 'Demo Admin',
        email: 'admin@stylehub.com',
        password: adminHash,
        role: 'admin',
        phone: '+94 77 123 4567',
        secondary_phone: '+94 11 234 5678'
      }
    ];

    const { error: userErr } = await supabase.from('users').upsert(usersData, { onConflict: 'email' });
    if (userErr) console.log('User seed note:', userErr.message);
    else console.log('✅ Sample users (sarah@example.com & admin@stylehub.com) seeded to Supabase.');

    // 3. Seed Products
    const productsData = [
      {
        name: 'Tailored Velvet Executive Blazer',
        category: 'Suits & Tailoring',
        price: 189.99,
        original_price: 249.99,
        description: 'Single-breasted velvet blazer with silk lapel accent.',
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
        stock_quantity: 45,
        is_featured: true,
        is_new_arrival: true
      },
      {
        name: 'Haute Couture Silk Evening Gown',
        category: 'Women Fashion',
        price: 299.99,
        original_price: 399.99,
        description: 'Floor-length pure Mulberry silk evening gown.',
        images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800'],
        stock_quantity: 20,
        is_featured: true,
        is_new_arrival: true
      },
      {
        name: 'Executive Italian Wool Trench Coat',
        category: 'Men Fashion',
        price: 349.99,
        original_price: 449.99,
        description: 'Double-breasted Italian virgin wool trench coat.',
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=800'],
        stock_quantity: 30,
        is_featured: true,
        is_new_arrival: false
      }
    ];

    const { error: prodErr } = await supabase.from('products').insert(productsData);
    if (prodErr) console.log('Product seed note:', prodErr.message);
    else console.log('✅ Luxury fashion products seeded to Supabase.');

    console.log('🎉 Supabase database seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seedSupabase();
