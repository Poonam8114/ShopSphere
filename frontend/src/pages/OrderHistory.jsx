import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-black mb-8 tracking-tight uppercase flex items-center gap-3">
        <ClipboardList size={28} className="text-indigo-600" />
        Order History
      </h1>

      {error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl space-y-5">
          <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <ClipboardList size={30} />
          </div>
          <h2 className="text-lg font-bold">No orders placed yet</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto font-light">
            Once you make a purchase, your orders list, delivery timelines, and tracking statuses will appear here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow hover:scale-[1.01] transition-transform"
          >
            Explore Catalog
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Desktop Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-900/60 text-gray-400 uppercase font-extrabold border-b border-gray-100 dark:border-zinc-800 tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Delivery Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-medium">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/10">
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-250 truncate max-w-[120px]">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                          : 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/order-confirmation?orderId=${order._id}`}
                        className="inline-flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400 font-bold hover:underline"
                        title="View Details"
                      >
                        <Eye size={14} />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
