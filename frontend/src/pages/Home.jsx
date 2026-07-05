import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X, Heart, ShieldAlert, Laptop, Watch, Shirt, Armchair } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { wishlistItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // API State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Counts
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Read URL params
  const searchKeyword = searchParams.get('search') || '';
  const showWishlistOnly = searchParams.get('wishlist') === 'true';
  const urlCategory = searchParams.get('category') || '';

  // Sync category state with URL if category is clicked from Footer or elsewhere
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      // If we are only showing wishlist items, bypass API fetching for general list
      if (showWishlistOnly) {
        setProducts(wishlistItems);
        setTotal(wishlistItems.length);
        setPages(1);
        setPage(1);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          keyword: searchKeyword,
          category: selectedCategory,
          minPrice,
          maxPrice,
          rating: selectedRating,
          sortBy,
          pageSize: 8,
        };

        // Filter out empty params
        Object.keys(params).forEach((key) => {
          if (params[key] === '' || params[key] === undefined || params[key] === null) {
            delete params[key];
          }
        });

        const { data } = await api.get('/api/products', { params });
        setProducts(data.products);
        setPages(data.pages);
        setPage(data.page);
        setTotal(data.total);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    searchKeyword,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedRating,
    sortBy,
    showWishlistOnly,
    wishlistItems,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating('');
    setSortBy('newest');
    setSearchParams({});
    setPage(1);
  };

  const removeSearchKeyword = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const removeWishlistFilter = () => {
    searchParams.delete('wishlist');
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Visual Banner Header */}
      {!showWishlistOnly && !searchKeyword && (
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 md:p-12 shadow-md">
          {/* Decorative backdrop shapes */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-xl space-y-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Summer Collection 2026
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Upgrade Your Tech <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Elevate Your Comfort
              </span>
            </h1>
            <p className="text-sm text-gray-300 max-w-sm font-light">
              Explore our curated select lines of premium gadgets, high-fidelity audio equipment, and ergonomic workstations.
            </p>
          </div>
        </div>
      )}

      {/* Main Contents Panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side Filters Sidebar (Desktop) */}
        {!showWishlistOnly && (
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-darkCard p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal size={14} />
                  Filters
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={10} />
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</h4>
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <button
                    onClick={() => { setSelectedCategory('All'); setPage(1); }}
                    className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setPage(1); }}
                      className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                          : 'hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Range</h4>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="number"
                    placeholder="Min ($)"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Max ($)"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Minimum Rating</h4>
                <select
                  value={selectedRating}
                  onChange={(e) => { setSelectedRating(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">★ 4.5 & up</option>
                  <option value="4.0">★ 4.0 & up</option>
                  <option value="3.5">★ 3.5 & up</option>
                  <option value="3.0">★ 3.0 & up</option>
                </select>
              </div>
            </div>
          </aside>
        )}

        {/* Right Side Product Grid & Controls */}
        <div className="flex-1 space-y-6">
          {/* Header Controllers (Search result tags, sorter, mobile filter triggers) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {showWishlistOnly ? 'Your Wishlist' : 'Products Listing'}
              </span>
              <span className="text-xs font-bold bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-gray-700 dark:text-gray-300">
                {total} Items
              </span>
              {searchKeyword && (
                <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 px-2.5 py-1 rounded-full font-semibold">
                  Search: "{searchKeyword}"
                  <button onClick={removeSearchKeyword} className="hover:text-red-500"><X size={12} /></button>
                </span>
              )}
              {showWishlistOnly && (
                <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-2.5 py-1 rounded-full font-semibold">
                  Wishlist Mode
                  <button onClick={removeWishlistFilter} className="hover:text-indigo-600"><X size={12} /></button>
                </span>
              )}
            </div>

            {/* Sorters */}
            {!showWishlistOnly && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                  className="lg:hidden flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-semibold"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </button>
                <div className="relative flex items-center gap-1.5 flex-1 sm:flex-initial">
                  <ArrowUpDown size={14} className="text-gray-400 hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                    className="w-full sm:w-44 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                  >
                    <option value="newest">Sort by: Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Filters Dropdown Drawer */}
          {showFiltersMobile && !showWishlistOnly && (
            <div className="lg:hidden bg-white dark:bg-darkCard p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-5 animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase">Filters Panel</h3>
                <button onClick={handleResetFilters} className="text-xs text-indigo-600 font-bold">Reset All</button>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase">Category</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => { setSelectedCategory('All'); setPage(1); }}
                    className={`text-xs px-3 py-1.5 rounded-lg ${
                      selectedCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-zinc-800'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedCategory(c); setPage(1); }}
                      className={`text-xs px-3 py-1.5 rounded-lg ${
                        selectedCategory === c ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-zinc-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Min Price</h4>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Max Price</h4>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Min Rating</h4>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Any</option>
                  <option value="4.5">★ 4.5 & up</option>
                  <option value="4.0">★ 4.0 & up</option>
                  <option value="3.0">★ 3.0 & up</option>
                </select>
              </div>
              <button
                onClick={() => setShowFiltersMobile(false)}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          )}

          {/* Product Grid Display */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 border border-red-100 dark:border-red-950/20 bg-red-50/20 rounded-3xl text-center">
              <ShieldAlert className="text-red-500 mb-4" size={40} />
              <h3 className="font-extrabold text-base text-gray-800 dark:text-white">API Connection Offline</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1">{error}</p>
              <button
                onClick={() => setPage(page)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Retry Request
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-darkCard rounded-3xl text-center border border-gray-100 dark:border-zinc-800">
              {showWishlistOnly ? (
                <Heart size={44} className="text-red-300 dark:text-red-800 mb-4 animate-pulse" />
              ) : (
                <Search size={44} className="text-indigo-300 dark:text-indigo-800 mb-4" />
              )}
              <h3 className="font-extrabold text-lg">No products found</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                {showWishlistOnly
                  ? 'Your wishlist is empty. Browse products and click the heart icon to save products here.'
                  : 'We couldn’t find anything matching your search filters. Try widening your price ranges or changing categories.'}
              </p>
              {!showWishlistOnly && (
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Reset Search Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    page === p
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-md shadow-indigo-100 dark:shadow-none'
                      : 'border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
