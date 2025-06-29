import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUsers,
  faChevronLeft,
  faTag,
  faCheckCircle,
  faSpinner,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookPage.css';

const BookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  useEffect(() => {
    if (!product) {
      navigate('/home');
    }
  }, [product, navigate]);

  if (!product) return null;

  const [participants, setParticipants] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const availability = {
    '2024-03-15': { status: 'available' },
    '2024-03-16': { status: 'available' },
    '2024-03-17': { status: 'closed' },
    '2024-03-18': { status: 'available' },
    '2024-03-19': { status: 'limited' },
  };

  const generateCalendarDays = (date) => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const startDay = monthStart.getDay();
    for(let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for(let d = 1; d <= monthEnd.getDate(); d++) {
      const day = new Date(date.getFullYear(), date.getMonth(), d);
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (date) => {
    if(!date) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    const dateString = date.toISOString().split('T')[0];
    if (availability[dateString]?.status !== 'closed') {
      setSelectedDate(date);
    }
  };

  const handleMonthChange = (increment) => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + increment)));
    setSelectedDate(null);
  };

  const applyCoupon = () => {
    if (coupon === 'ADVENTURE20') {
      setDiscount(20);
      setCouponMessage('20% discount applied!');
    } else if (coupon === 'EXPERIENCE10') {
      setDiscount(10);
      setCouponMessage('10% discount applied!');
    } else {
      setDiscount(0);
      setCouponMessage('Invalid coupon code');
    }
  };

  const calculateTotal = () => {
    const subtotal = product.price * participants;
    const discountAmount = subtotal * discount / 100;
    const gst = (subtotal - discountAmount) * 0.18;
    return Math.round(subtotal - discountAmount + gst);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const bookingDetails = {
      productId: product._id,
      title: product.title,
      state: product.location.state,
      city: product.location.city,
      companyName: product.company_Name,
      providerName: product.provider_Name,
      selectedDate,
      participants,
      totalPrice: calculateTotal(),
      gst: ((product.price * participants - (product.price * participants * discount / 100)) * 0.18).toFixed(2),
      discount,
      coupon,
      timestamp: new Date(),
      img1: product.img1,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingDetails),
      });

      if (response.ok) {
        navigate('/payment', {
          state: {
            product: {
              title: product.title,
              img1: product.img1,
              price: product.price,
            },
            bookingDetails: {
              totalPrice: bookingDetails.totalPrice,
              gst: bookingDetails.gst,
              participants,
              selectedDate,
            },
          },
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to save booking details:', errorData);
        toast.error(`Failed to save booking: ${errorData.message || 'Unknown server error'}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Checkout failed. Please try again later.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const days = generateCalendarDays(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="book-page">
      <div className="book-page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2>Book Now</h2>
      </div>

      <div className="book-page-content">
        <div className="experience-gallery">
          <div
            className="main-image"
            style={{ backgroundImage: `url(${product.img1})` }}
          />
        </div>

        <div className="experience-details">
          <h2>{product.title}</h2>
          <div className="price">₹{product.price} <span>per person</span></div>
        </div>

        <div className="booking-form">
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faUsers} /> Participants
            </label>
            <div className="participants-selector">
              <button
                onClick={() => setParticipants(Math.max(1, participants - 1))}
                disabled={participants <= 1}
              >
                -
              </button>
              <span>{participants}</span>
              <button
                onClick={() => setParticipants(Math.min(15, participants + 1))}
                disabled={participants >= 15}
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faCalendarAlt} /> Select Date
            </label>
            <div className="calendar-header">
              <button onClick={() => handleMonthChange(-1)}>{'<'}</button>
              <h4>
                {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
              </h4>
              <button onClick={() => handleMonthChange(1)}>{'>'}</button>
            </div>
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
              ))}
              {days.map((day, index) => {
                if(!day) return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                
                const dateString = day.toISOString().split('T')[0];
                const dayAvailability = availability[dateString] || { status: 'available' };
                const isPastDate = day < today;

                return (
                  <button
                    key={dateString}
                    className={`calendar-day 
                      ${dayAvailability.status} 
                      ${selectedDate?.toDateString() === day.toDateString() ? 'selected' : ''}
                      ${isPastDate ? 'past' : ''}`}
                    onClick={() => handleDateSelect(day)}
                    disabled={isPastDate || dayAvailability.status === 'closed'}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group coupon-section">
            <label>
              <FontAwesomeIcon icon={faTag} /> Coupon Code
            </label>
            <div className="coupon-input">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
            {couponMessage && (
              <div className={`coupon-message ${discount > 0 ? 'success' : 'error'}`}>
                {couponMessage}
              </div>
            )}
          </div>

          <div className="price-summary">
            <div className="price-line">
              <span>Subtotal ({participants} {participants > 1 ? 'people' : 'person'})</span>
              <span>₹{(product.price * participants).toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="price-line discount">
                <span>Discount ({discount}%)</span>
                <span>-₹{(product.price * participants * discount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="price-line">
              <span>GST (18%)</span>
              <span>₹{((product.price * participants - (product.price * participants * discount / 100)) * 0.18).toFixed(2)}</span>
            </div>
            <div className="price-line total">
              <span>Total Amount</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <button
            className="checkout-button"
            disabled={!selectedDate || isCheckingOut}
            onClick={handleCheckout}
          >
            {isCheckingOut ? (
              <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '0.5rem' }} />
            ) : (
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '0.5rem' }} />
            )}
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookPage;