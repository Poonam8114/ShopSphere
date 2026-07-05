const Cart = require('../models/Cart');

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [] });
  }
  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    if (!cart) {
      return res.json({ products: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart or increase quantity
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    const cart = await getOrCreateCart(req.user._id);

    const itemIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists, update quantity
      cart.products[itemIndex].quantity += qty;
    } else {
      // Product doesn't exist, push new item
      cart.products.push({ product: productId, quantity: qty });
    }

    const updatedCart = await cart.save();
    const populatedCart = await updatedCart.populate('products.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quantity of product in cart
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    if (qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = qty;
      const updatedCart = await cart.save();
      const populatedCart = await updatedCart.populate('products.product');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    const updatedCart = await cart.save();
    const populatedCart = await updatedCart.populate('products.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
