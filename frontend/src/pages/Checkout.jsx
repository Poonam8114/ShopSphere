import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api, { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';

const Checkout = () => {
  const { user } = useAuth();
  const {
    cartItems,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod,
    getSubtotal,
    getShippingCost,
    getTax,
    getTotal,
    clearCart,
  } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Multi-step Checkout page state: 'shipping' | 'payment'
  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shipping Form Inputs
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  // Mock Payment Inputs
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      addToast('Please fill in all shipping details', 'warning');
      return;
    }
    setShippingAddress({ address, city, postalCode, country });
    setStep('payment');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (step === 'payment') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        addToast('Please complete credit card details', 'warning');
        return;
      }
    }

    setLoading(true);
    setError(null);

    // Format items for backend Order Model Schema
    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.image,
    }));

    try {
      const orderPayload = {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        totalAmount: getTotal(),
      };

      const { data } = await api.post('/api/orders', orderPayload);
      
      // Success triggers
      addToast('Order placed successfully! Thank you.', 'success');
      clearCart();
      navigate(`/order-confirmation?orderId=${data._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      addToast('Order placement failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const tax = getTax();
  const total = getTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Checkout Progress Header */}
      <div className="flex items-center justify-center gap-2 mb-10 text-xs font-bold uppercase tracking-wider text-gray-400">
        <span className={step === 'shipping' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-200'}>
          1. Shipping Address
        </span>
        <ChevronRight size={14} />
        <span className={step === 'payment' ? 'text-indigo-600 dark:text-indigo-400' : ''}>
          2. Simulated Payment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Step details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <h2 className="text-lg font-extrabold uppercase tracking-wide flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-indigo-600" />
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Coding Ave, Apt 4B"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Silicon Valley"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="94025"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="USA"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  Continue to Payment
                  <ChevronRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-6 animate-in slide-in-from-right duration-300">
                <h2 className="text-lg font-extrabold uppercase tracking-wide flex items-center gap-2 mb-4">
                  <CreditCard size={18} className="text-indigo-600" />
                  Simulated Payment Method
                </h2>

                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 p-4 rounded-xl text-xs text-indigo-700 dark:text-indigo-400 font-semibold leading-relaxed mb-4">
                  💡 This is a portfolio sandbox simulator. You can fill in any mock details to complete the payment flow and verify database integrations.
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="flex-1 py-3 border border-gray-250 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 dark:shadow-none"
                  >
                    {loading ? <Spinner size="sm" color="white" /> : 'Pay & Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right side checkout items summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Summary</h3>

            {/* Item listing */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex gap-3 items-center justify-between text-xs">
                  <div className="flex gap-2.5 items-center truncate">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-950 flex-shrink-0 border border-gray-100 dark:border-zinc-800">
                      <img src={item.product.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold truncate text-gray-800 dark:text-gray-200">{item.product.title}</h4>
                      <span className="text-gray-400 font-medium">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-gray-100 dark:border-zinc-800" />

            <div className="space-y-3.5 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <hr className="border-gray-100 dark:border-zinc-800" />
              <div className="flex justify-between text-sm text-gray-950 dark:text-white font-extrabold pt-1">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Extra trust elements */}
            <div className="pt-2 text-center text-[10px] text-gray-400 font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-indigo-500" />
              Secure 256-bit SSL Encrypted Connection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
