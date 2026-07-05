import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Sun, Moon, Search, Menu, X, User, LayoutDashboard, LogOut, ClipboardList, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount, wishlistItems } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-300">
                <ShoppingBag size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-indigo-700 dark:from-white dark:to-indigo-400 bg-clip-text text-transparent">
                ShopSphere
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-gray-100 transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist Button */}
            <Link
              to="/?wishlist=true"
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors relative"
              title="View Wishlist"
            >
              <Heart size={18} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingBag size={18} />
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Card */}
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {isAdmin() && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors font-medium"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <LayoutDashboard size={16} />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors font-medium"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <UserCircle size={16} />
                          My Profile
                        </Link>
                        <Link
                          to="/order-history"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors font-medium"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <ClipboardList size={16} />
                          Order History
                        </Link>
                        <hr className="my-1 border-gray-100 dark:border-zinc-800" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors font-medium"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-100 dark:shadow-none hover:scale-[1.03]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-3 transition-colors duration-300">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg block"
              onClick={() => setIsOpen(false)}
            >
              Browse Products
            </Link>
            <Link
              to="/?wishlist=true"
              className="flex justify-between items-center px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <span>Wishlist</span>
              <span className="bg-indigo-600 text-[10px] font-bold text-white rounded-full px-2 py-0.5">
                {wishlistItems.length}
              </span>
            </Link>
            <Link
              to="/cart"
              className="flex justify-between items-center px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <span>Shopping Cart</span>
              <span className="bg-indigo-600 text-[10px] font-bold text-white rounded-full px-2 py-0.5">
                {getCartCount()}
              </span>
            </Link>

            {user ? (
              <>
                <hr className="border-gray-100 dark:border-zinc-800" />
                <div className="px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                  Logged in as {user.name}
                </div>
                {isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg block text-indigo-600 dark:text-indigo-400"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg block"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/order-history"
                  className="px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg block"
                  onClick={() => setIsOpen(false)}
                >
                  Order History
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg block"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <hr className="border-gray-100 dark:border-zinc-800" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-center text-sm font-semibold border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-center text-sm font-semibold bg-indigo-600 text-white dark:bg-indigo-500 rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
