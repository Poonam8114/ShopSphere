import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      addToast(`${product.title} added to cart!`);
    } else {
      addToast('Product is out of stock', 'warning');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (isInWishlist(product._id)) {
      addToast(`${product.title} removed from wishlist`);
    } else {
      addToast(`${product.title} added to wishlist!`);
    }
  };

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="group relative rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-darkCard overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-900">
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60';
          }}
        />
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
            Featured
          </div>
        )}
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 p-2 rounded-full shadow-md bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-gray-100 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-all text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 z-10"
        title="Toggle Wishlist"
      >
        <Heart
          size={16}
          className={inWishlist ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}
        />
      </button>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category & Ratings */}
        <div className="flex justify-between items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/products/${product._id}`} className="block flex-grow">
          <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Bottom Panel */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-zinc-800/80">
          <span className="text-base font-extrabold text-gray-900 dark:text-gray-50">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm shadow-indigo-100 dark:shadow-none hover:scale-105 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag size={15} />
            <span className="text-xs font-semibold px-0.5">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
