const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  approvePayment,
  updateOrderStatus, 
  requestReturn, 
  approveReturnPickup,
  markReturnCollected,
  releaseRewardPointsRefund
} = require('../controllers/orderController');
const { protect, protectOptional } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Order placement supports optional token (logged in or guest checkout)
router.post('/', protectOptional, createOrder);

// Customer endpoints
router.get('/my-orders', protect, getMyOrders);
router.post('/:id/return', protect, requestReturn);

// Payment Manager & Admin Payment Approval
router.put('/:id/approve-payment', protect, authorize('admin', 'payment_manager'), approvePayment);

// Delivery Manager & Staff Delivery & Return Processing
router.put('/:id/status', protect, authorize('admin', 'staff', 'delivery_manager'), updateOrderStatus);
router.put('/:id/approve-return-pickup', protect, authorize('admin', 'delivery_manager'), approveReturnPickup);
router.put('/:id/mark-return-collected', protect, authorize('admin', 'delivery_manager'), markReturnCollected);

// Admin Reward Points Refund Release
router.put('/:id/release-reward-points', protect, authorize('admin'), releaseRewardPointsRefund);

// Get All Orders (Admin / Staff / Managers)
router.get('/', protect, authorize('admin', 'staff', 'delivery_manager', 'payment_manager'), getAllOrders);

module.exports = router;
