const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const connectDB = require('../config/db');

const ensureConnected = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {}
  }
  return mongoose.connection.readyState === 1;
};

const memoryOrders = [
  {
    _id: 'ord_1001',
    user: 'usr_customer',
    customerName: 'Digoarachchi S. A.',
    customerEmail: 'student1@sliit.lk',
    customerPhone: '+94 77 123 4567',
    orderItems: [
      {
        title: 'Urban Cyberpunk Oversized Hoodie',
        quantity: 1,
        price: 85.00,
        selectedSize: 'L',
        selectedColor: 'Black',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600'
      }
    ],
    shippingAddress: {
      street: '45 Galle Road',
      city: 'Colombo 03',
      state: 'Western Province',
      zipCode: '00300',
      country: 'Sri Lanka'
    },
    paymentMethod: 'Bank Deposit / Slip Upload',
    paymentSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    totalAmount: 85.00,
    status: 'Payment Pending (Slip Uploaded)',
    returnStatus: 'None',
    trackingNumber: 'SH-TRK-98742',
    createdAt: new Date()
  }
];

// @desc    Create a new order (Supports guest or logged-in users)
// @route   POST /api/orders
// @access  Public / Customer
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentSlipUrl, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    const trackingNumber = 'SH-TRK-' + Math.floor(10000 + Math.random() * 90000);
    const userId = req.user ? req.user.id : null;

    const isDb = await ensureConnected();
    if (isDb) {
      const order = await Order.create({
        user: userId,
        customerName: req.user ? req.user.name : (shippingAddress?.name || 'Valued Customer'),
        customerEmail: req.user ? req.user.email : (shippingAddress?.email || 'customer@larvofashion.com'),
        customerPhone: req.user ? (req.user.phone || '+94 77 123 4567') : (shippingAddress?.phone || '+94 77 123 4567'),
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'Bank Deposit / Slip Upload',
        paymentSlipUrl: paymentSlipUrl || '',
        totalAmount: totalAmount || 0,
        status: 'Payment Pending (Slip Uploaded)',
        trackingNumber
      });
      console.log(`[Order API] Created order ${order._id} in MongoDB Atlas for ${order.customerEmail}`);
      return res.status(201).json({ success: true, message: 'Order placed successfully', order });
    } else {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        user: userId || 'usr_customer',
        customerName: req.user ? req.user.name : (shippingAddress?.name || 'Valued Customer'),
        customerEmail: req.user ? req.user.email : (shippingAddress?.email || 'customer@larvofashion.com'),
        customerPhone: req.user ? (req.user.phone || '+94 77 123 4567') : (shippingAddress?.phone || '+94 77 123 4567'),
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'Bank Deposit / Slip Upload',
        paymentSlipUrl: paymentSlipUrl || '',
        totalAmount: totalAmount || 0,
        status: 'Payment Pending (Slip Uploaded)',
        returnStatus: 'None',
        trackingNumber,
        createdAt: new Date()
      };
      memoryOrders.unshift(newOrder);
      return res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    }
  } catch (error) {
    console.error('[Order API Error]', error);
    next(error);
  }
};

// @desc    Get customer's own orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const isDb = await ensureConnected();
    if (isDb) {
      const queryList = [];
      if (req.user) {
        if (req.user.id) queryList.push({ user: req.user.id });
        if (req.user.email) queryList.push({ customerEmail: req.user.email });
      }
      const filter = queryList.length > 0 ? { $or: queryList } : {};
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      const orders = memoryOrders.filter(o => o.user === req.user.id || o.customerEmail === req.user.email || req.user.role === 'customer');
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for Admin, Payment Manager, Delivery Manager
// @route   GET /api/orders
// @access  Private (Admin / Staff / Managers)
const getAllOrders = async (req, res, next) => {
  try {
    const isDb = await ensureConnected();
    if (isDb) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      return res.json({ success: true, count: memoryOrders.length, orders: memoryOrders });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Payment Manager approves customer bank payment slip (Stage 1 -> Stage 2)
// @route   PUT /api/orders/:id/approve-payment
// @access  Private (Payment Manager / Admin)
const approvePayment = async (req, res, next) => {
  try {
    const { action } = req.body; // 'Approve' or 'Reject'
    const newStatus = action === 'Reject' ? 'Cancelled' : 'Payment Approved - Ready for Packing';

    const isDb = await ensureConnected();
    if (isDb) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.status = newStatus;
      order.paymentApprovedBy = req.user ? req.user.email : 'payment@larvofashion.com';
      order.paymentApprovedAt = new Date();
      await order.save();

      return res.json({ success: true, message: `Payment ${action.toLowerCase()}d. Status updated to ${newStatus}`, order });
    } else {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.status = newStatus;
      order.paymentApprovedBy = req.user ? req.user.email : 'payment@larvofashion.com';
      order.paymentApprovedAt = new Date();
      return res.json({ success: true, message: `Payment ${action.toLowerCase()}d. Status updated to ${newStatus}`, order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delivery Manager updates delivery status & tracking info
// @route   PUT /api/orders/:id/status
// @access  Private (Delivery Manager / Admin / Staff)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, deliveryNotes } = req.body;

    const isDb = await ensureConnected();
    if (isDb) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (status) order.status = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (deliveryNotes) order.deliveryNotes = deliveryNotes;

      await order.save();
      return res.json({ success: true, message: `Order delivery status updated to ${status}`, order });
    } else {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (status) order.status = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (deliveryNotes) order.deliveryNotes = deliveryNotes;

      return res.json({ success: true, message: `Order delivery status updated to ${status}`, order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Customer submits a return request with reason & damage image proof (US21)
// @route   POST /api/orders/:id/return
// @access  Private/Customer
const requestReturn = async (req, res, next) => {
  try {
    const { returnReason, damageImageUrl } = req.body;

    const isDb = await ensureConnected();
    if (isDb) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = 'Requested';
      order.returnReason = returnReason || 'Damaged or wrong item';
      order.damageImageUrl = damageImageUrl || '';
      order.returnRequestedAt = new Date();
      await order.save();

      return res.json({ success: true, message: 'Return request submitted with damage proof image', order });
    } else {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = 'Requested';
      order.returnReason = returnReason || 'Damaged or wrong item';
      order.damageImageUrl = damageImageUrl || '';
      order.returnRequestedAt = new Date();
      return res.json({ success: true, message: 'Return request submitted with damage proof image', order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delivery Manager approves return & schedules courier pickup
// @route   PUT /api/orders/:id/approve-return-pickup
// @access  Private (Delivery Manager / Admin)
const approveReturnPickup = async (req, res, next) => {
  try {
    const { action } = req.body; // 'Approve' or 'Reject'
    const newReturnStatus = action === 'Reject' ? 'Rejected' : 'Pickup Scheduled';

    const isDb = await ensureConnected();
    if (isDb) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = newReturnStatus;
      await order.save();

      return res.json({ success: true, message: `Return request ${action.toLowerCase()}d and courier pickup scheduled`, order });
    } else {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = newReturnStatus;
      return res.json({ success: true, message: `Return request ${action.toLowerCase()}d and courier pickup scheduled`, order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delivery Manager marks return package collected from customer
// @route   PUT /api/orders/:id/mark-return-collected
// @access  Private (Delivery Manager / Admin)
const markReturnCollected = async (req, res, next) => {
  try {
    const isDb = await ensureConnected();
    if (isDb) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = 'Return Package Collected';
      order.returnCollectedAt = new Date();
      await order.save();

      return res.json({ success: true, message: 'Return package collected from customer', order });
    } else {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = 'Return Package Collected';
      order.returnCollectedAt = new Date();
      return res.json({ success: true, message: 'Return package collected from customer', order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Admin releases reward points refund into customer's account (US23)
// @route   PUT /api/orders/:id/release-reward-points
// @access  Private (Admin)
const releaseRewardPointsRefund = async (req, res, next) => {
  try {
    const isDb = await ensureConnected();
    if (isDb) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = 'Approved & Points Credited';
      await order.save();

      // Calculate reward points refund (10 points per $1 refunded)
      const pointsEarned = Math.round(order.totalAmount * 10);
      if (order.user) {
        await User.findByIdAndUpdate(order.user, {
          $inc: { rewardPoints: pointsEarned }
        });
      }

      return res.json({ 
        success: true, 
        message: `Refund released! ${pointsEarned} reward points credited to customer account`, 
        order,
        pointsEarned
      });
    } else {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.returnStatus = 'Approved & Points Credited';
      const pointsEarned = Math.round(order.totalAmount * 10);
      return res.json({ 
        success: true, 
        message: `Refund released! ${pointsEarned} reward points credited to customer account`, 
        order,
        pointsEarned 
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  approvePayment,
  updateOrderStatus,
  requestReturn,
  approveReturnPickup,
  markReturnCollected,
  releaseRewardPointsRefund
};
