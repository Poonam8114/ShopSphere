import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, ClipboardList, DollarSign, Loader2, ArrowRight } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';

// Chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/api/orders/analytics');
        setAnalytics(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 border border-gray-250 dark:border-zinc-800 rounded-3xl bg-white dark:bg-darkCard">
          <h2 className="text-lg font-bold text-red-500">Failed to load analytics dashboard</h2>
          <p className="text-xs text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const { summary, salesByCategory, salesByMonth, topProducts } = analytics;

  // Chart 1: Revenue by Month Data
  const monthlyChartData = {
    labels: salesByMonth.map((s) => s.month),
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: salesByMonth.map((s) => s.revenue),
        backgroundColor: 'rgba(99, 102, 241, 0.85)', // Indigo-500
        borderRadius: 8,
      },
    ],
  };

  // Chart 2: Sales by Category Data
  const categoryKeys = Object.keys(salesByCategory);
  const categoryChartData = {
    labels: categoryKeys,
    datasets: [
      {
        label: 'Revenue by Category',
        data: categoryKeys.map((k) => salesByCategory[k]),
        backgroundColor: [
          'rgba(99, 102, 241, 0.75)', // Indigo
          'rgba(139, 92, 246, 0.75)', // Violet
          'rgba(236, 72, 153, 0.75)', // Pink
          'rgba(20, 184, 166, 0.75)', // Teal
          'rgba(245, 158, 11, 0.75)', // Amber
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen space-y-8">
      {/* Dashboard title and navigation headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <LayoutDashboard size={28} className="text-indigo-650" />
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Monitor product inventories, system orders, customer base and revenues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Summary grid stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-450 block">Total Revenue</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">${summary.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <ClipboardList size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-455 block">Total Orders</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">{summary.totalOrders}</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-460 block">Total Products</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">{summary.totalProducts}</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-465 block">Customers</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">{summary.totalUsers}</span>
          </div>
        </div>
      </div>

      {/* Graphical charts visualization section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Monthly Revenue Bar chart */}
        <div className="lg:col-span-2 bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Monthly Revenue Stream</h3>
          <div className="min-h-[250px] flex items-center">
            {salesByMonth.length === 0 ? (
              <p className="text-xs text-gray-500 mx-auto">No sales records to display chart.</p>
            ) : (
              <Bar
                data={monthlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            )}
          </div>
        </div>

        {/* Right Side: Category pie chart */}
        <div className="lg:col-span-1 bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Sales by Category</h3>
          <div className="min-h-[250px] flex items-center justify-center">
            {categoryKeys.length === 0 ? (
              <p className="text-xs text-gray-500">No category sales metrics.</p>
            ) : (
              <div className="max-w-[200px] w-full">
                <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top selling products table */}
      <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Top 5 Best Selling Products</h3>
        
        {topProducts.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">No orders completed to list top products.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-900/60 text-gray-400 uppercase font-extrabold border-b border-gray-100 dark:border-zinc-800 tracking-wider">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3 text-center">Quantity Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-medium">
                {topProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/20 dark:hover:bg-zinc-900/10">
                    <td className="px-6 py-3.5 font-bold text-gray-800 dark:text-gray-200">{p.title}</td>
                    <td className="px-6 py-3.5 text-center font-extrabold text-indigo-650 dark:text-indigo-400">{p.qty} items</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
