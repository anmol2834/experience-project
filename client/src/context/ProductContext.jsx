import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const context_of_product = createContext();

function ProductContext({ children }) {
  const { token } = useAuth();
  const [productLoading, setProductLoading] = useState(true);
  const [productInfo, setProductInfo] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userUpdated, setUserUpdated] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductLoading(true);
        // Fetch products without authentication
        const productRes = await fetch('http://localhost:5000/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const productData = await productRes.json();
        setProductInfo(productData);

        // Fetch wishlist only if the user is authenticated
        if (token) {
          const wishlistRes = await fetch('http://localhost:5000/wishlist', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const wishlistData = await wishlistRes.json();
          setWishlistItems(wishlistData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setProductLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const addToWishlist = async (productId) => {
    if (!token) return; // Only authenticated users can add to wishlist
    try {
      const res = await fetch('http://localhost:5000/wishlist/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
    if (!token) return; // Only authenticated users can remove from wishlist
    try {
      const res = await fetch('http://localhost:5000/wishlist/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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

  const incrementUserUpdated = () => {
    setUserUpdated((prev) => prev + 1); // Increment the counter on each update
  };

  return (
    <context_of_product.Provider
      value={{ productInfo, productLoading, wishlistItems, addToWishlist, removeFromWishlist, userUpdated, incrementUserUpdated }}
    >
      {children}
    </context_of_product.Provider>
  );
}

export default ProductContext;