const mongoose = require('mongoose');

const poItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productTitle: { 
    type: String, 
    required: true 
  },
  quantityOrdered: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  quantityReceived: { 
    type: Number, 
    default: 0 
  },
  unitCost: { 
    type: Number, 
    required: true, 
    min: 0 
  }
});

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  supplier: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Supplier', 
    required: true 
  },
  items: [poItemSchema],
  totalCost: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Draft', 'Ordered', 'Partially Received', 'Completed', 'Cancelled'], 
    default: 'Ordered' 
  },
  expectedDeliveryDate: { 
    type: Date 
  },
  receivedDate: { 
    type: Date 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
