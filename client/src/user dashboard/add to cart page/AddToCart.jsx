import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { context_of_product } from '../../context/ProductProvider';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaStar, FaPlus, FaMinus, FaTrash, FaMapMarked, FaLocationArrow } from 'react-icons/fa';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './AddToCart.css';
import emptyCart from './empty-cart.svg';

const AddToCart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, removeFromCart, updateCartQuantity, fetchCart } = useContext(context_of_product);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartQuantity(productId, newQuantity);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.productId.price * item.quantity),
    0
  );

  const handleBookNow = () => {
    if (cartItems.length === 0) return;
    if (!token) {
      navigate('/login', { state: { from: location } });
      return;
    }
    navigate('/checkout', { state: { cartItems } });
  };

  return (
    <div className="add-to-cart-container">
      <header className="cart-header">
        <button onClick={handleBack} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#e3e3e3"><path d="M366.15-253.85 140-480l226.15-226.15L408.31-664l-154 154H820v60H254.31l154 154-42.16 42.15Z" /></svg>
        </button>
        <h1>Your Experience Cart</h1>
        <div className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</div>
      </header>

      <main className="cart-main">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img src={emptyCart} alt="Empty cart" className="empty-cart-image" />
            <h2>Your "Experience Cart" is empty</h2>
            <p>Add some exciting experiences to get started!</p>
            <button onClick={() => navigate('/home')} className="explore-button">
              Explore Experiences
            </button>
          </div>
        ) : (
          <div className="cart-items-container">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.productId._id} className="cart-item">
                  <div
                    className="item-image"
                    style={{ backgroundImage: `url(${item.productId.img1})` }}
                    onClick={() => navigate(`/experience/${item.productId._id}`)}
                  ></div>
                  <div className="item-details">
                    <h3 onClick={() => navigate(`/experience/${item.productId._id}`)}>{item.productId.title}</h3>
                    <div className="location-rating">
                      <span className="location">
                        <FaLocationArrow className="location-icon" />
                        {item.productId.city}, {item.productId.state}
                        </span>
                      <div className="rating">
                        <FaStar className="rating-icon"/>
                        <span>{item.productId.rating || '4.5'}</span>
                      </div>
                    </div>
                    <div className="quantity-control">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="item-price-actions">
                    <span className="price">${(item.productId.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => handleRemoveFromCart(item.productId._id)}
                      className="remove-button"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Service Fee</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {cartItems.length > 0 && (
        <div className="checkout-bar">
          <div className="total-price">
            <span>Total:</span>
            <span className="amount">${totalPrice.toFixed(2)}</span>
          </div>
          <button onClick={handleBookNow} className="book-all-button">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCart;