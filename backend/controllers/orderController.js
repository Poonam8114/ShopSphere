const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Double check stock and adjust
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.title} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.title}` });
      }
    }

    // Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      // Simulate direct payment for this portfolio demonstration if simulated checkout is paid
      paymentStatus: 'Paid',
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (order) {
      // Check if user is admin or the order owner
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate revenue
    const orders = await Order.find({ paymentStatus: 'Paid' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Sales by Category
    const products = await Product.find({});
    const salesByCategory = {};
    for (const order of orders) {
      for (const item of order.items) {
        const prod = products.find((p) => p._id.toString() === item.product.toString());
        const category = prod ? prod.category : 'Unknown';
        salesByCategory[category] = (salesByCategory[category] || 0) + (item.price * item.quantity);
      }
    }

    // Monthly sales revenue mapping
    const salesByMonth = {};
    for (const order of orders) {
      const monthYear = order.createdAt.toLocaleString('default', { month: 'short', year: '2-digit' });
      salesByMonth[monthYear] = (salesByMonth[monthYear] || 0) + order.totalAmount;
    }

    // Top Selling Products (Title -> Qty)
    const productSalesCount = {};
    for (const order of orders) {
      for (const item of order.items) {
        productSalesCount[item.title] = (productSalesCount[item.title] || 0) + item.quantity;
      }
    }
    const topProducts = Object.entries(productSalesCount)
      .map(([title, qty]) => ({ title, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    res.json({
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
      salesByCategory,
      salesByMonth: Object.entries(salesByMonth).map(([month, revenue]) => ({ month, revenue })),
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getSalesAnalytics,
};
