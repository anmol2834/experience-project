import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const context_of_product = createContext();

function ProductContext({ children }) {
  const { token } = useAuth();
  const [productLoading, setProductLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [productInfo, setProductInfo] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setProductLoading(false);
        setWishlistLoading(false);
        return;
      }

      try {
        // Fetch products
        setProductLoading(true);
        const productRes = await fetch('http://localhost:5000/products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!productRes.ok) {
          throw new Error(`HTTP error! Status: ${productRes.status}`);
        }

        const productData = await productRes.json();
        setProductInfo(productData);

        // Fetch wishlist
        setWishlistLoading(true);
        const wishlistRes = await fetch('http://localhost:5000/wishlist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!wishlistRes.ok) {
          throw new Error(`HTTP error! Status: ${wishlistRes.status}`);
        }

        const wishlistData = await wishlistRes.json();
        setWishlistItems(wishlistData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setProductLoading(false);
        setWishlistLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <context_of_product.Provider value={{ productInfo, productLoading, wishlistItems, wishlistLoading }}>
      {children}
    </context_of_product.Provider>
  );
}

export default ProductContext;