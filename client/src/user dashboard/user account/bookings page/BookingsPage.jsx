import React, { useState, useEffect } from 'react';
import './BookingsPage.css';
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes, faStar, faTicket, faCalendarAlt, faClock, faMapMarkerAlt, faCheckCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingBookingId, setCancelingBookingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const navigate = useNavigate();
  
  // Mock booking data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings([
        // {
        //   id: '1',
        //   title: 'FPV Drone Experience',
        //   date: '2025-07-15',
        //   time: '14:00 - 16:00',
        //   location: 'Adventure Park, San Francisco',
        //   status: 'confirmed',
        //   price: '$89.99',
        //   image: 'https://images.unsplash.com/photo-1623874106686-5be7d9a4d6ab?q=80&w=1000'
        // },
        // {
        //   id: '2',
        //   title: 'Midnight Horror Stories',
        //   date: '2025-07-20',
        //   time: '21:00 - 23:30',
        //   location: 'The Haunted Mansion, Oakland',
        //   status: 'pending',
        //   price: '$49.99',
        //   image: 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?q=80&w=1000'
        // },
        // {
        //   id: '3',
        //   title: 'Gamer Bash Tournament',
        //   date: '2025-08-05',
        //   time: '18:00 - 22:00',
        //   location: 'Game Hub, San Jose',
        //   status: 'confirmed',
        //   price: '$69.99',
        //   image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000'
        // },
        // {
        //   id: '4',
        //   title: 'Wisdom Hour: Philosophy Discussion',
        //   date: '2025-07-25',
        //   time: '19:00 - 21:00',
        //   location: 'Central Library, San Francisco',
        //   status: 'pending',
        //   price: '$39.99',
        //   image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1000'
        // }
      ]);
      setLoading(false);
    }, 1500);
  }, []);
  
  const handleCancelBooking = (bookingId) => {
    setCancelingBookingId(bookingId);
    setShowCancelModal(true);
  };
  
  const confirmCancel = () => {
    setIsCanceling(true);
    // Simulate cancellation process
    setTimeout(() => {
      setBookings(bookings.filter(booking => booking.id !== cancelingBookingId));
      setShowCancelModal(false);
      setIsCanceling(false);
      setCancelingBookingId(null);
    }, 1200);
  };
  
  const cancelCancel = () => {
    setShowCancelModal(false);
    setCancelingBookingId(null);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="bookings-container">
        <h2 className="bookings-title">Your Bookings</h2>
        
        <div className="bookings-loading">
          {[...Array(4)].map((_, index) => (
            <motion.div 
              key={index}
              className="booking-card loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="booking-image loading-bg"></div>
              <div className="booking-details">
                <div className="booking-status loading-status"></div>
                <div className="booking-title loading-line"></div>
                <div className="booking-info">
                  <div className="booking-info-item loading-line"></div>
                  <div className="booking-info-item loading-line"></div>
                  <div className="booking-info-item loading-line"></div>
                </div>
                <div className="booking-price loading-line"></div>
                <div className="booking-actions">
                  <div className="booking-button loading-button"></div>
                  <div className="booking-button loading-button"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className='bookings-container'>
      <motion.h2 
        className="bookings-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Bookings
      </motion.h2>
      
      {bookings.length === 0 ? (
        <motion.div 
          className="no-bookings"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="no-bookings-illustration">
            <div className="ticket-svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" 
                      stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6a5acd" />
                    <stop offset="100%" stopColor="#ff694e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="sparkles">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="sparkle" 
                  style={{
                    '--delay': `${i * 0.1}s`,
                    '--size': `${Math.random() * 12 + 8}px`,
                    '--angle': `${Math.random() * 360}deg`,
                    '--distance': `${Math.random() * 40 + 60}px`
                  }}
                ></div>
              ))}
            </div>
          </div>
          <h3>Your Adventure Awaits!</h3>
          <p>Your journey hasn't started yet. Discover amazing experiences waiting for you to explore.</p>
          <motion.button 
            className="explore-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
          >
            <FontAwesomeIcon icon={faStar} style={{ marginRight: '8px' }} />
            Find Your Next Experience
          </motion.button>
        </motion.div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking, index) => (
            <motion.div 
              key={booking.id}
              className="booking-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(106, 90, 205, 0.3)" }}
            >
              <div 
                className="booking-image"
                style={{ backgroundImage: `url(${booking.image})` }}
              ></div>
              
              <div className="booking-details">
                <div className="booking-status">
                  {booking.status === 'confirmed' ? (
                    <span className="confirmed">
                      <FontAwesomeIcon icon={faCheckCircle} /> Confirmed
                    </span>
                  ) : (
                    <span className="pending">
                      <FontAwesomeIcon icon={faHourglassHalf} /> Pending
                    </span>
                  )}
                </div>
                
                <h3 className="booking-title">{booking.title}</h3>
                
                <div className="booking-info">
                  <div className="booking-info-item">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>{booking.date}</span>
                  </div>
                  <div className="booking-info-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{booking.time}</span>
                  </div>
                  <div className="booking-info-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{booking.location}</span>
                  </div>
                </div>
                
                <div className="booking-price">{booking.price}</div>
                
                <div className="booking-actions">
                  <motion.button 
                    className="download-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon icon={faDownload} /> Download Ticket
                  </motion.button>
                  
                  {booking.status === 'confirmed' ? (
                    <motion.button 
                      className="review-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={faStar} /> Write Review
                    </motion.button>
                  ) : (
                    <motion.button 
                      className="cancel-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <motion.div 
          className="cancel-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="cancel-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button className="close-modal" onClick={cancelCancel}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className="modal-icon">
              <FontAwesomeIcon icon={faTimes} />
            </div>
            
            <h3>Cancel Booking?</h3>
            <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
            
            <div className="modal-actions">
              <motion.button 
                className="modal-cancel"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelCancel}
                disabled={isCanceling}
              >
                Go Back
              </motion.button>
              
              <motion.button 
                className="modal-confirm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmCancel}
                disabled={isCanceling}
              >
                {isCanceling ? (
                  <div className="spinner"></div>
                ) : (
                  "Confirm Cancel"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingsPage;