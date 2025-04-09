import { useContext } from 'react';
import { motion } from 'framer-motion';
import './Wishlist.css';
import { context_of_product } from '../../../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, productLoading: wishlistLoading, removeFromWishlist } = useContext(context_of_product);
  const navigate = useNavigate();

  if (wishlistLoading) {
    return (
      <div className="wishlist-loading">
        <div className="wireframe-header">
          <div className="wireframe-title"></div>
          <div className="wireframe-count"></div>
        </div>
        <div className="wireframe-grid">
          {[0, 1, 2].map((_, index) => (
            <div key={index} className="wireframe-item">
              <div className="wireframe-image"></div>
              <div className="wireframe-details">
                <div className="wireframe-name"></div>
                <div className="wireframe-price"></div>
                <div className="wireframe-specs"></div>
                <div className="wireframe-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleViewDetails = (product) => {
    const scrollPosition = window.scrollY;

    navigate('/experience-details', {
      state: {
        product: {
          title: product.title,
          state: product.state,
          city: product.city,
          price: product.price,
          rating: product.rating || product.ratings,
          productId: product._id,
          img1: product.img1,
          img2: product.img2,
          img3: product.img3,
          img4: product.img4,
          img5: product.img5,
          img6: product.img6,
          img7: product.img7,
          img8: product.img8,
        },
        from: '/account/wishlist',
        scrollPosition,
        productId: product._id,
      },
    });
  };

  return (
    <motion.div
      className="wishlist-container"
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
              <p className="item-price">₹{item.productId.price.toFixed(2)}</p>
              <div className="item-specs">
                <span>State: {item.productId.state}</span>
                <span>City: {item.productId.city}</span>
              </div>
              <button
                onClick={() => handleViewDetails(item.productId)}
                className="view-details-btn"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Wishlist;