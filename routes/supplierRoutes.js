const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  createPurchaseOrder,
  getPurchaseOrders,
  receiveDelivery
} = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public or Protected routes
router.use(protect);

// Purchase Orders endpoints
router.route('/purchase-orders')
  .get(authorize('admin', 'staff'), getPurchaseOrders)
  .post(authorize('admin'), createPurchaseOrder);

router.put('/purchase-orders/:id/receive', authorize('admin', 'staff'), receiveDelivery);

// Supplier CRUD endpoints
router.route('/')
  .get(authorize('admin', 'staff'), getSuppliers)
  .post(authorize('admin'), createSupplier);

router.route('/:id')
  .get(authorize('admin', 'staff'), getSupplierById)
  .put(authorize('admin'), updateSupplier)
  .delete(authorize('admin'), deleteSupplier);

module.exports = router;
