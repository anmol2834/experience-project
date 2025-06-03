import { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const context_of_product = createContext();

function ProductProvider({ children }) {
  const { token } = useAuth();
  const [productLoading, setProductLoading] = useState(true);
  const [productInfo, setProductInfo] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userUpdated, setUserUpdated] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductLoading(true);
        const url = searchQuery
          ? `${process.env.REACT_APP_API_URL}/products/search?query=${encodeURIComponent(searchQuery)}`
          : `${process.env.REACT_APP_API_URL}/products`;
        const productRes = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const productData = await productRes.json();
        setProductInfo(productData);

        if (token) {
          const wishlistRes = await fetch(`${process.env.REACT_APP_API_URL}/wishlist`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const wishlistData = await wishlistRes.json();
          setWishlistItems(wishlistData);

          await fetchCart();
        } else {
          setWishlistItems([]);
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setProductLoading(false);
      }
    };
    fetchData();
  }, [token, searchQuery]); // Add searchQuery as a dependency

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
      } else {
        console.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
      } else {
        console.error('Failed to remove from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
      } else {
        console.error('Failed to update cart quantity');
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const addToWishlist = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/add`, {
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
      } else {
        const errorData = await res.json();
        console.error('Failed to add to wishlist:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
    };

    const removeFromWishlist = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/remove`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.productId && item.productId._id !== productId)
        );
      } else {
        const errorData = await res.json();
        console.error('Failed to remove from wishlist:', errorData.message);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const incrementUserUpdated = () => {
    setUserUpdated((prev) => prev + 1);
  };

  return (
    <context_of_product.Provider
      value={{
        productInfo,
        productLoading,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        userUpdated,
        incrementUserUpdated,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        fetchCart,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </context_of_product.Provider>
  );
}

export default ProductProvider;