
import React from 'react';
import { motion } from 'framer-motion';
import './Wishlist.css';

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: 'Dot Heritage Jumper',
      price: 24.99,
      size: 'M',
      color: 'Grey',
      image: 'https://via.placeholder.com/150x200/555/333?text=Jumper'
    },
    {
      id: 2,
      name: 'White Skirt',
      price: 114.59,
      size: 'M',
      color: 'White',
      image: 'https://via.placeholder.com/150x200/555/333?text=Skirt'
    },
    {
      id: 3,
      name: 'Winter Hat',
      price: 20.45,
      size: 'L',
      color: 'Grey',
      image: 'https://via.placeholder.com/150x200/555/333?text=Hat'
    },
    {
      id: 4,
      name: 'Blue Jeans',
      price: 82.99,
      size: 'M',
      color: 'Blue',
      image: 'https://via.placeholder.com/150x200/555/333?text=Jeans'
    }
  ];

  return (
    <motion.div 
      className="wishlist-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="wishlist-header">
        <h2>Wishlist</h2>
        <span className="item-count">{wishlistItems.length} items found</span>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <motion.div 
            key={item.id}
            className="wishlist-item"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="item-image-container">
              <img 
                src={item.image} 
                alt={item.name} 
                className="item-image"
              />
              <button className="wishlist-remove-btn">
                <span>×</span>
              </button>
            </div>

            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)}</p>
              <div className="item-specs">
                <span>Size: {item.size}</span>
                <span>Color: {item.color}</span>
              </div>
              <button className="add-to-bag-btn">
                Add to Bag
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7h-3l-1-1-1 1h-3V5h-2v2H6l-1 1v12h16V8l-1-1zm-8 8H9v-2h2v2zm0-4H9V9h2v2zm4 4h-2v-2h2v2zm0-4h-2V9h2v2z"/>
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