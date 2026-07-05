import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Star, ChevronRight, MessageSquareCode, Award, ShieldCheck, Truck } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock >= quantity) {
      addToCart(product, quantity);
      addToast(`${quantity} x ${product.title} added to cart!`);
    } else {
      addToast('Cannot add: insufficient stock', 'error');
    }
  };

  const handleWishlist = () => {
    if (product) {
      toggleWishlist(product);
      if (isInWishlist(product._id)) {
        addToast(`${product.title} removed from wishlist`);
      } else {
        addToast(`${product.title} added to wishlist!`);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please write a review comment', 'warning');
      return;
    }

    setReviewLoading(true);
    setReviewError(null);
    try {
      await api.post(`/api/products/${id}/reviews`, { rating, comment });
      addToast('Review submitted successfully!');
      setComment('');
      setRating(5);
      // Reload product to fetch updated reviews
      fetchProduct();
    } catch (err) {
      setReviewError(getErrorMessage(err));
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="p-8 border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-darkCard">
          <h3 className="text-lg font-bold text-red-500">Failed to load product</h3>
          <p className="text-xs text-gray-500 mt-2">{error || 'Product not found'}</p>
          <Link to="/" className="inline-block mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isWish = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <ChevronRight size={12} />
        <Link to={`/?category=${product.category}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-gray-900 dark:text-gray-200 truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white dark:bg-darkCard p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/80 shadow-sm">
        
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-50 dark:border-zinc-850">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60';
            }}
          />
          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-lg shadow">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Meta Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
              </div>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
                <MessageSquareCode size={14} />
                {product.numReviews} Customer Reviews
              </span>
            </div>

            {/* Price & Stock status */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
              <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            <hr className="border-gray-100 dark:border-zinc-800" />

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">{product.description}</p>
            </div>
          </div>

          {/* Action Center (Quantities & Add Buttons) */}
          <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-zinc-800/80">
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-900">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-sm font-bold hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3.5 py-1.5 text-sm font-bold hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  product.stock === 0
                    ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 hover:scale-[1.01]'
                }`}
              >
                <ShoppingBag size={18} />
                Add to Shopping Bag
              </button>

              <button
                onClick={handleWishlist}
                className={`p-3.5 border rounded-xl flex items-center justify-center transition-all ${
                  isWish
                    ? 'border-red-100 bg-red-50 text-red-500 dark:border-red-950/30 dark:bg-red-950/20 dark:text-red-400 hover:scale-[1.03]'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-red-500 dark:border-zinc-800 dark:hover:bg-zinc-900 hover:scale-[1.03]'
                }`}
                title="Toggle Wishlist"
              >
                <Heart size={18} className={isWish ? 'fill-red-500 dark:fill-red-400' : ''} />
              </button>
            </div>

            {/* Quick Guarantees bar */}
            <div className="grid grid-cols-3 gap-2 pt-6 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              <div className="flex flex-col items-center gap-1.5">
                <Truck size={16} className="text-indigo-500" />
                <span>Free shipping &gt;$100</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck size={16} className="text-indigo-500" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Award size={16} className="text-indigo-500" />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Questions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Review summary & Write review form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-darkCard p-6 rounded-3xl border border-gray-100 dark:border-zinc-800/80 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold tracking-wide uppercase">Write a Review</h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-3 text-xs bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg">
                    {reviewError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-gray-300 dark:text-zinc-700 hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Star
                          size={24}
                          className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-zinc-700'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Your Comment</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your experience with this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                >
                  {reviewLoading ? <Spinner size="sm" color="white" /> : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="p-4 border border-indigo-50 dark:border-indigo-950/20 rounded-xl bg-indigo-50/30 text-center space-y-3">
                <p className="text-xs text-gray-500">You must be logged in to write reviews for our products.</p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reviews timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-darkCard p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/80 shadow-sm">
            <h3 className="text-base font-extrabold tracking-wide uppercase mb-6 flex items-center gap-2">
              Reviews History
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 font-bold">
                {product.reviews.length}
              </span>
            </h3>

            {product.reviews.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-400 dark:text-gray-500">
                <Star size={36} className="mx-auto mb-2 text-gray-300 dark:text-zinc-800" />
                <p className="text-xs">No reviews for this product yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-gray-50 dark:divide-zinc-800/85">
                {product.reviews.map((rev, index) => (
                  <div key={rev._id} className={`pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold uppercase">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{rev.name}</h4>
                          <span className="text-[10px] text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Rating stars */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-zinc-800'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-350 leading-relaxed font-light">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
