import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState(() => {
    const localWishlist = localStorage.getItem('wishlistItems');
    return localWishlist ? JSON.parse(localWishlist) : [];
  });
  const [shippingAddress, setShippingAddress] = useState(() => {
    const localAddress = localStorage.getItem('shippingAddress');
    return localAddress ? JSON.parse(localAddress) : { address: '', city: '', postalCode: '', country: '' };
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  // Sync wishlist to localstorage
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Sync shippingAddress to localstorage
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  // Load cart when user logs in or out
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await api.get('/api/cart');
          setCartItems(data.products || []);
        } catch (error) {
          console.error('Error fetching cart from DB:', error);
          // Fallback to local storage if API fails
          const localCart = localStorage.getItem('guestCart');
          if (localCart) setCartItems(JSON.parse(localCart));
        } finally {
          setLoading(false);
        }
      } else {
        // Guest mode - load from localStorage
        const localCart = localStorage.getItem('guestCart');
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
    };

    loadCart();
  }, [user]);

  // Save guest cart to localStorage
  const saveGuestCart = (items) => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(items));
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      setLoading(true);
      try {
        const { data } = await api.post('/api/cart/add', {
          productId: product._id,
          quantity,
        });
        setCartItems(data.products || []);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest local update
      setCartItems((prevItems) => {
        const itemExists = prevItems.find((item) => item.product._id === product._id);
        let updated;
        if (itemExists) {
          updated = prevItems.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updated = [...prevItems, { product, quantity }];
        }
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  const updateCartQty = async (productId, quantity) => {
    if (quantity < 1) return;
    if (user) {
      setLoading(true);
      try {
        const { data } = await api.put('/api/cart/update', {
          productId,
          quantity,
        });
        setCartItems(data.products || []);
      } catch (error) {
        console.error('Error updating cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems((prevItems) => {
        const updated = prevItems.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      setLoading(true);
      try {
        const { data } = await api.delete('/api/cart/remove', {
          data: { productId },
        });
        setCartItems(data.products || []);
      } catch (error) {
        console.error('Error removing from cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems((prevItems) => {
        const updated = prevItems.filter((item) => item.product._id !== productId);
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      setLoading(true);
      try {
        await api.delete('/api/cart/clear');
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('guestCart');
    }
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  // Calculations
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 100 ? 0 : 10.0; // Free shipping above $100
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% sales tax
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost() + getTax();
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        shippingAddress,
        paymentMethod,
        loading,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setShippingAddress,
        setPaymentMethod,
        getSubtotal,
        getShippingCost,
        getTax,
        getTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
