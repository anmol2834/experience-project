import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import './Wishlist.css';
import { context_of_product } from '../../../context/ProductContext';

const Wishlist = () => {
  const { wishlistItems, productLoading: wishlistLoading, removeFromWishlist } = useContext(context_of_product);

  if (wishlistLoading) {
    return <div className="wishlist-loading">Loading...</div>;
  }

  return (
    <motion.div
      className="help-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="wishlist-header">
        <h2>Wishlist</h2>
        <span className="item-count">{wishlistItems.length} items found</span>
      </div>
      <div className="wishlist-grid">
        {wishlistItems.filter(item => item.productId).map((item) => (
          <motion.div
            key={item._id}
            className="wishlist-item"
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="item-image-container">
              <img
                src={item.productId.img1}
                alt={item.productId.title}
                className="item-image"
              />
              <button
                className="wishlist-remove-btn"
                onClick={() => removeFromWishlist(item.productId._id)}
              >
                <span>×</span>
              </button>
            </div>
            <div className="item-details">
              <h3 className="item-name">{item.productId.title}</h3>
              <p className="item-price">${item.productId.price.toFixed(2)}</p>
              <div className="item-specs">
                <span>State: {item.productId.state}</span>
                <span>City: {item.productId.city}</span>
              </div>
              <button className="add-to-bag-btn">
                Add to Cart
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7h-3l-1-1-1 1h-3V5h-2v2H6l-1 1v12h16V8l-1-1zm-8 8H9v-2h2v2zm0-4H9V9h2v2zm4 4h-2v-2h2v2zm0-4h-2V9h2v2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Wishlist;