const mongoose = require('mongoose');
const Product = require('../models/Product');

const fallbackProducts = [
  {
    _id: 'p1',
    title: 'Urban Cyberpunk Oversized Hoodie',
    price: 85.00,
    originalPrice: 110.00,
    category: 'Streetwear & Hoodies',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal'],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
    stockCount: 14,
    rating: 4.9,
    description: 'High-density heavy cotton streetwear hoodie featuring a oversized drop-shoulder cut.'
  },
  {
    _id: 'p2',
    title: 'Tailored Italian Wool Suit Blazer',
    price: 240.00,
    originalPrice: 290.00,
    category: 'Formal & Suits',
    gender: 'MEN',
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy Blue', 'Midnight Black'],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
    stockCount: 6,
    rating: 5.0,
    description: 'Bespoke single-breasted blazer constructed with 100% fine Italian virgin wool.'
  },
  {
    _id: 'p3',
    title: 'Vintage Japanese Selvedge Denim Jacket',
    price: 135.00,
    originalPrice: 160.00,
    category: 'Selvedge Denim & Jeans',
    gender: 'WOMEN',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Indigo Blue'],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
    stockCount: 3,
    rating: 4.8,
    description: 'Handcrafted 14oz shuttle-loomed Japanese denim jacket with custom brass hardware.'
  },
  {
    _id: 'p4',
    title: 'Minimalist Matte Leather Crossbody Cap',
    price: 45.00,
    originalPrice: 60.00,
    category: 'Luxury Accessories & Caps',
    gender: 'UNISEX',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Tan'],
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600',
    stockCount: 22,
    rating: 4.7,
    description: 'Full-grain Nappa leather cap with adjustable brass buckle clasp.'
  },
  {
    _id: 'p5',
    title: 'StyleHub Edition Silk Evening Trench Coat',
    price: 195.00,
    originalPrice: 240.00,
    category: 'Outerwear & Trench Coats',
    gender: 'WOMEN',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Cream', 'Navy'],
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600',
    stockCount: 8,
    rating: 4.9,
    description: 'Water-resistant double-breasted trench coat with removable silk waist belt.'
  },
  {
    _id: 'p6',
    title: 'Street Culture Graphic Heavyweight Tee',
    price: 38.00,
    originalPrice: 50.00,
    category: 'Casual Apparel & Tees',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
    stockCount: 30,
    rating: 4.6,
    description: '240 GSM organic cotton t-shirt with high-density screenprinted chest graphic.'
  }
];

const getProducts = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: products.length, products });
    } else {
      return res.json({ success: true, count: fallbackProducts.length, products: fallbackProducts });
    }
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product });
    } else {
      const product = fallbackProducts.find(p => p._id === req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product });
    }
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(req.body);
      return res.status(201).json({ success: true, message: 'Product created in MongoDB Atlas', product });
    } else {
      const newProd = { _id: 'p_' + Date.now(), ...req.body, rating: 5.0 };
      fallbackProducts.unshift(newProd);
      return res.status(201).json({ success: true, message: 'Product created', product: newProd });
    }
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product updated successfully', product });
    } else {
      const idx = fallbackProducts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) {
        fallbackProducts[idx] = { ...fallbackProducts[idx], ...req.body };
        return res.json({ success: true, message: 'Product updated', product: fallbackProducts[idx] });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      const idx = fallbackProducts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) {
        fallbackProducts.splice(idx, 1);
        return res.json({ success: true, message: 'Product deleted' });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
