const mongoose = require('mongoose');
const Order = require('../models/Order');

const memoryOrders = [
  {
    _id: 'ord_1001',
    user: 'usr_customer',
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
    paymentMethod: 'Credit Card',
    totalAmount: 85.00,
    status: 'Shipped',
    trackingNumber: 'SH-TRK-98742',
    createdAt: new Date()
  }
];

const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    const trackingNumber = 'SH-TRK-' + Math.floor(10000 + Math.random() * 90000);

    if (mongoose.connection.readyState === 1) {
      const order = await Order.create({
        user: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
        totalAmount,
        status: 'Processing',
        trackingNumber
      });
      return res.status(201).json({ success: true, message: 'Order placed successfully', order });
    } else {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        user: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
        totalAmount,
        status: 'Processing',
        trackingNumber,
        createdAt: new Date()
      };
      memoryOrders.unshift(newOrder);
      return res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    }
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      const orders = memoryOrders.filter(o => o.user === req.user.id || req.user.role === 'customer');
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      return res.json({ success: true, count: memoryOrders.length, orders: memoryOrders });
    }
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, message: 'Order status updated', order });
    } else {
      const order = memoryOrders.find(o => o._id === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.status = status;
      return res.json({ success: true, message: 'Order status updated', order });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
