const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getSalesAnalytics,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get my orders
router.get('/myorders', protect, getMyOrders);

// Get sales analytics (Admin dashboard)
router.get('/analytics', protect, admin, getSalesAnalytics);

// Order CRUD roots
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// Detailed order views & update status
router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
