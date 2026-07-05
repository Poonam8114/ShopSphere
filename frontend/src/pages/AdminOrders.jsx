import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Eye, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const AdminOrders = () => {
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Status transition loading state
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders');
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus });
      addToast(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen space-y-6">
      
      {/* Header info */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase flex items-center gap-3">
          <ClipboardCheck size={28} className="text-indigo-650" />
          Manage Orders
        </h1>
        <p className="text-xs text-gray-505 font-bold">Admin Customer Order Pipeline Controller</p>
      </div>

      {/* Orders listing table */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl text-gray-450">
          No orders have been placed in the system yet.
        </div>
      ) : (
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-55 dark:bg-zinc-900/60 text-gray-400 uppercase font-extrabold border-b border-gray-100 dark:border-zinc-800 tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4 text-center">Pipeline Status Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-850 font-medium">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/20 dark:hover:bg-zinc-900/10">
                    <td className="px-6 py-3 font-bold text-gray-800 dark:text-gray-250 truncate max-w-[120px]">{order._id}</td>
                    <td className="px-6 py-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{order.user?.name || 'Guest'}</h4>
                        <span className="text-[10px] text-gray-400">{order.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400 font-semibold">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                    </td>
                    <td className="px-6 py-3 font-extrabold text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {updatingId === order._id ? (
                        <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-650 font-bold">
                          <Loader2 size={12} className="animate-spin" /> Updating...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-250 focus:outline-none ${
                              order.orderStatus === 'Delivered'
                                ? 'border-green-200 text-green-700 dark:text-green-400 bg-green-50/10'
                                : order.orderStatus === 'Shipped'
                                ? 'border-blue-200 text-blue-750 dark:text-blue-400 bg-blue-50/10'
                                : 'border-indigo-200 text-indigo-700 dark:text-indigo-400 bg-indigo-50/10'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      )}
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

export default AdminOrders;
