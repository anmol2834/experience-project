import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const context_of_product = createContext();

function ProductContext({ children }) {
  const { token } = useAuth();
  const [productLoading, setProductLoading] = useState(true);
  const [productInfo, setProductInfo] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setProductLoading(false);
        return;
      }
      try {
        setProductLoading(true);
        const productRes = await fetch('http://localhost:5000/products', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const productData = await productRes.json();
        setProductInfo(productData);

        const wishlistRes = await fetch('http://localhost:5000/wishlist', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const wishlistData = await wishlistRes.json();
        setWishlistItems(wishlistData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setProductLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const addToWishlist = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/wishlist/add', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        const newWishlistItem = await res.json();
        setWishlistItems((prevItems) => [...prevItems, newWishlistItem]);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/wishlist/remove', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.productId._id !== productId)
        );
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <context_of_product.Provider
      value={{ productInfo, productLoading, wishlistItems, addToWishlist, removeFromWishlist }}
    >
      {children}
    </context_of_product.Provider>
  );
}

export default ProductContext;