const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Supplier name is required'], 
    trim: true 
  },
  contactPerson: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  email: { 
    type: String, 
    required: [true, 'Supplier email is required'], 
    lowercase: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Supplier phone is required'], 
    trim: true 
  },
  address: { 
    type: String, 
    default: '' 
  },
  categoriesSupplied: [{ 
    type: String 
  }],
  rating: { 
    type: Number, 
    default: 5, 
    min: 1, 
    max: 5 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Supplier', supplierSchema);
