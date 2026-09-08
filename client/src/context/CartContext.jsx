import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { ToastContext } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error fetching cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, token]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.warning('Please log in to add items to cart');
      return false;
    }
    try {
      const res = await axios.post('/api/cart', { productId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await axios.patch(`/api/cart/${itemId}`, { quantity });
      setCart(res.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`/api/cart/${itemId}`);
      setCart(res.data.cart);
      toast.info('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item from cart');
      console.error('Error removing from cart', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setCart({ items: [] });
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  };

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartItemCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
