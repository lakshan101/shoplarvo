const express = require('express');
const router = express.Router();
const { getAdminStats, getEmployees, createEmployee, getCoupons, createCoupon } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin', 'staff'));

router.get('/stats', getAdminStats);
router.get('/employees', getEmployees);
router.post('/employees', createEmployee);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);

module.exports = router;
