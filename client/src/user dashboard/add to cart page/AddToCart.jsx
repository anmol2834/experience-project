
import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { context_of_product } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaStar, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import './AddToCart.css';
import emptyCart from './empty-cart.svg';

const AddToCart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('adventureCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useState(() => {
    localStorage.setItem('adventureCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
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
          <FaArrowLeft /> Back
        </button>
        <h1>Your Adventure Cart</h1>
        <div className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</div>
      </header>

      {/* Cart Items Section */}
      <main className="cart-main">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img src={emptyCart} alt="Empty cart" className="empty-cart-image" />
            <h2>Your adventure cart is empty</h2>
            <p>Add some exciting experiences to get started!</p>
            <button onClick={() => navigate('/home')} className="explore-button">
              Explore Experiences
            </button>
          </div>
        ) : (
          <div className="cart-items-container">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div 
                    className="item-image" 
                    style={{ backgroundImage: `url(${item.image})` }}
                    onClick={() => navigate(`/experience/${item._id}`)}
                  ></div>
                  <div className="item-details">
                    <h3 onClick={() => navigate(`/experience/${item._id}`)}>{item.title}</h3>
                    <div className="location-rating">
                      <span className="location">{item.location}</span>
                      <div className="rating">
                        <FaStar className="star" />
                        <span>{item.rating || '4.5'}</span>
                      </div>
                    </div>
                    <div className="quantity-control">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="item-price-actions">
                    <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="remove-button"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
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

      {/* Fixed bottom bar with checkout */}
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