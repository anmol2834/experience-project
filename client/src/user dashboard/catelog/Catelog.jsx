import React, { useContext, useEffect, useState } from 'react';
import './catelog.css';
import Catelogcard from './catelog card/Catelogcard';
import { context_of_product } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

function Catelog() {
  const { productInfo, productLoading } = useContext(context_of_product);
  const { token } = useAuth();
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist data when the component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setWishlistLoading(false); // No token, no wishlist to fetch
        return;
      }
      try {
        setWishlistLoading(true);
        const res = await fetch('http://localhost:5000/wishlist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setWishlistItems(data);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  // Show loading until both product and wishlist data are fetched
  if (productLoading || wishlistLoading) {
    return <div className="catelog-loading">Loading...</div>;
  }

  return (
    <div className="catelogs">
      <h1>Explore Experiences</h1>
      <div className="catelog-aligner">
        {productInfo.map((value, index) => {
          const isLiked = wishlistItems.some((item) => item.productId._id === value._id);
          return (
            <Catelogcard
              key={index}
              state={value.state}
              city={value.city}
              title={value.title}
              price={value.price}
              img={value.experience_img}
              stock={value.stock}
              mrp={value.mrp}
              ratings={value.rating}
              productId={value._id}
              isLiked={isLiked} // Pass initial like status
            />
          );
        })}
      </div>
    </div>
  );
}

export default Catelog;