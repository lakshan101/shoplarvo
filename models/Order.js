const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.Mixed },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  selectedSize: { type: String, default: 'M' },
  selectedColor: { type: String, default: 'Black' },
  image: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.Mixed },
  customerName: { type: String, default: 'Valued Customer' },
  customerEmail: { type: String, default: 'customer@larvofashion.com' },
  customerPhone: { type: String, default: '+94 77 123 4567' },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: { type: String, default: 'Bank Deposit / Slip Upload' },
  paymentSlipUrl: { type: String, default: '' },
  paymentApprovedBy: { type: String, default: '' },
  paymentApprovedAt: { type: Date },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: [
      'Payment Pending (Slip Uploaded)', 
      'Payment Approved - Ready for Packing', 
      'Dispatched to Courier (In Transit)', 
      'Successfully Delivered', 
      'Cancelled'
    ], 
    default: 'Payment Pending (Slip Uploaded)' 
  },
  courierName: { type: String, default: 'Larvo Express Courier' },
  trackingNumber: { type: String, default: '' },
  deliveryNotes: { type: String, default: '' },
  
  // Return Workflow Fields (US21, US22, US23)
  returnStatus: {
    type: String,
    enum: [
      'None', 
      'Requested', 
      'Pickup Scheduled', 
      'Return Package Collected', 
      'Approved & Points Credited', 
      'Rejected'
    ],
    default: 'None'
  },
  returnReason: { type: String, default: '' },
  damageImageUrl: { type: String, default: '' },
  returnRequestedAt: { type: Date },
  returnCollectedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
