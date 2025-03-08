
import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Wishlist.css';
import { context_of_product } from '../../../context/ProductContext';

const Wishlist = () => {

    const productInfo = useContext(context_of_product);
    
    return (
        <motion.div
            className="help-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="wishlist-header">
                <h2>Wishlist</h2>
                <span className="item-count">{productInfo.length} items found</span>
            </div>

            <div className="wishlist-grid">
                {productInfo.map((item, index) => (
                    <motion.div
                        key={index}
                        className="wishlist-item"
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="item-image-container">
                            <img
                                src={item.experience_img}
                                alt={item.title}
                                className="item-image"
                            />
                            <button className="wishlist-remove-btn">
                                <span>×</span>
                            </button>
                        </div>

                        <div className="item-details">
                            <h3 className="item-name">{item.title}</h3>
                            <p className="item-price">${item.price.toFixed(2)}</p>
                            <div className="item-specs">
                                <span>State: {item.state}</span>
                                <span>City: {item.city}</span>
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