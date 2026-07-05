import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, PackageCheck, Package, ShoppingBag, MapPin, ClipboardList } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        setError('No order ID provided');
        return;
      }
      try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 border border-gray-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-darkCard">
          <h2 className="text-lg font-bold text-red-500">Failed to retrieve order details</h2>
          <p className="text-xs text-gray-500 mt-2">{error || 'Order not found'}</p>
          <Link to="/" className="inline-block mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Tracking Timeline Status Mapping
  const statusSteps = [
    { label: 'Pending', icon: Package, key: 'Pending' },
    { label: 'Processing', icon: PackageCheck, key: 'Processing' },
    { label: 'Shipped', icon: Truck, key: 'Shipped' },
    { label: 'Delivered', icon: CheckCircle, key: 'Delivered' },
  ];

  const getStepIndex = (status) => {
    return statusSteps.findIndex((s) => s.key === status);
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8 animate-in fade-in duration-500">
      
      {/* Success Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full shadow-inner">
          <CheckCircle size={44} className="animate-bounce" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Order Confirmed!</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Thank you for your purchase. Your order number is <span className="font-bold text-gray-800 dark:text-white">{order._id}</span>.
        </p>
      </div>

      {/* Tracking Timeline Status Stepper */}
      <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-6 text-center">
          Order Status Tracking
        </h3>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-2">
          {/* Progress bar line (Desktop) */}
          <div className="absolute left-6 sm:left-[10%] right-0 sm:right-[10%] top-6 sm:top-[30%] h-full sm:h-1 w-0.5 sm:w-auto bg-gray-100 dark:bg-zinc-800 -z-10 hidden sm:block">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-500"
              style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {statusSteps.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            const isCompleted = idx <= currentStepIdx;
            const isActive = idx === currentStepIdx;

            return (
              <div
                key={stepItem.key}
                className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 sm:text-center w-full"
              >
                {/* Step Circle icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-md shadow-indigo-100 dark:shadow-none scale-105'
                      : 'bg-gray-50 text-gray-450 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800'
                  } ${isActive ? 'ring-4 ring-indigo-100 dark:ring-indigo-950/50' : ''}`}
                >
                  <Icon size={18} />
                </div>
                <div className="space-y-0.5">
                  <span
                    className={`text-xs font-bold block ${
                      isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
                    }`}
                  >
                    {stepItem.label}
                  </span>
                  {isActive && (
                    <span className="text-[9px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping details */}
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <MapPin size={15} />
            Delivery Details
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 font-light">
            <p className="font-bold text-gray-950 dark:text-white">{order.user.name}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2 font-semibold">Payment Status: <span className="font-bold text-green-600">{order.paymentStatus}</span></p>
          </div>
        </div>

        {/* Order total list summary */}
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <ShoppingBag size={15} />
            Products Purchased
          </h3>
          
          <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate font-medium">
                    <h4 className="truncate font-bold text-gray-800 dark:text-gray-250">{item.title}</h4>
                    <span className="text-gray-400">Qty: {item.quantity} x ${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <span className="font-bold text-gray-950 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-gray-100 dark:border-zinc-800" />
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="font-bold text-gray-500">Paid Amount</span>
            <span className="text-sm font-extrabold text-gray-950 dark:text-white">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Button options */}
      <div className="flex justify-center gap-4 pt-4">
        <Link
          to="/"
          className="px-5 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
        >
          <ShoppingBag size={14} />
          Back to Store Catalog
        </Link>
        <Link
          to="/order-history"
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] flex items-center gap-1.5 shadow"
        >
          <ClipboardList size={14} />
          View Order History
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
