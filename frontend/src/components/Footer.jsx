import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white">
                <ShoppingBag size={16} />
              </div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white">ShopSphere</span>
            </Link>
            <p className="text-xs leading-relaxed">
              Your ultimate destination for premium tech accessories, clothing, and home comfort. Scaled for speed and styled for performance.
            </p>
            <div className="flex gap-4 text-gray-400 dark:text-gray-500">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400"><Facebook size={16} /></a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400"><Twitter size={16} /></a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400"><Instagram size={16} /></a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400"><Github size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/?category=Electronics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Electronics</Link></li>
              <li><Link to="/?category=Accessories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Accessories</Link></li>
              <li><Link to="/?category=Apparel" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Apparel</Link></li>
              <li><Link to="/?category=Furniture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Office & Furniture</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">My Profile</Link></li>
              <li><Link to="/order-history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Order History</Link></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-4">Stay Connected</h4>
            <p className="text-xs leading-relaxed">Subscribe to get special discounts and notifications of product releases.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
              />
              <button className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold">
                Join
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-100 dark:border-zinc-800/80" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
          <span>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
