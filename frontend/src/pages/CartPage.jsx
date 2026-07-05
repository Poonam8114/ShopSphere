import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartPage = () => {
  const {
    cartItems,
    updateCartQty,
    removeFromCart,
    clearCart,
    getSubtotal,
    getShippingCost,
    getTax,
    getTotal,
  } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleQtyChange = (productId, newQty, stock) => {
    if (newQty > stock) {
      addToast(`Only ${stock} items available in stock`, 'warning');
      return;
    }
    if (newQty < 1) return;
    updateCartQty(productId, newQty);
  };

  const handleRemove = (productId, title) => {
    removeFromCart(productId);
    addToast(`${title} removed from cart`);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your shopping bag?')) {
      clearCart();
      addToast('Shopping bag cleared');
    }
  };

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const tax = getTax();
  const total = getTotal();

  // Progress to free shipping calculation (Free over $100)
  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-extrabold">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto font-light leading-relaxed">
          Looks like you haven’t added anything to your cart yet. Head back to the store homepage to explore our collections.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:scale-[1.01] transition-transform"
        >
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-black mb-8 tracking-tight uppercase">Your Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm divide-y divide-gray-50 dark:divide-zinc-800/80">
            {cartItems.map((item) => (
              <div key={item.product._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Product Detail info */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60';
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-2 py-0.5 rounded-full">
                      {item.product.category}
                    </span>
                    <Link to={`/products/${item.product._id}`} className="block">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-250 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                        {item.product.title}
                      </h3>
                    </Link>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 block">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Adjust Quantities & Removal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                  <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-950">
                    <button
                      onClick={() => handleQtyChange(item.product._id, item.quantity - 1, item.product.stock)}
                      className="px-2 py-1 hover:bg-gray-150 dark:hover:bg-zinc-800"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.product._id, item.quantity + 1, item.product.stock)}
                      className="px-2 py-1 hover:bg-gray-155 dark:hover:bg-zinc-800"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  
                  <span className="text-sm font-bold w-16 text-right hidden sm:block">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleRemove(item.product._id, item.product.title)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center px-4">
            <Link
              to="/"
              className="text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
            <button
              onClick={handleClear}
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              Clear Shopping Bag
            </button>
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Free Shipping Alert banner */}
          {shipping > 0 ? (
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 p-5 rounded-3xl space-y-2">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                Spend <span className="font-extrabold text-indigo-600 dark:text-indigo-400">${remainingForFreeShipping.toFixed(2)}</span> more to qualify for <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">FREE shipping</span>.
              </p>
              <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100/50 dark:border-green-900/30 p-4 rounded-3xl text-center text-xs text-green-700 dark:text-green-400 font-bold uppercase tracking-wider">
              🎉 You qualify for FREE shipping!
            </div>
          )}

          {/* Summary Details */}
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider">Order Summary</h3>
            
            <div className="space-y-3.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">${tax.toFixed(2)}</span>
              </div>
              <hr className="border-gray-100 dark:border-zinc-800" />
              <div className="flex justify-between text-sm text-gray-900 dark:text-white font-extrabold pt-1">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-md shadow-indigo-100 dark:shadow-none"
            >
              <CreditCard size={16} />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
