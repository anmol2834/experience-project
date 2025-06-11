import React, { useState, useEffect, useContext } from 'react';
import './Reviews.css';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronRight, faXmark, faPencil } from '@fortawesome/free-solid-svg-icons';

// Mock data - replace with actual API calls
const mockExperiences = [
  {
    id: 1,
    name: "Skydiving Adventure",
    image: "skydiving.jpg",
    reviewed: true,
    rating: 5,
    review: "Absolutely breathtaking experience! The instructors were professional and made me feel safe throughout the entire jump. The view from 15,000 feet was incredible. Would do it again in a heartbeat!",
    date: "2023-05-15"
  },
  {
    id: 2,
    name: "Wilderness Survival Camp",
    image: "survival.jpg",
    reviewed: true,
    rating: 4,
    review: "Challenging but incredibly rewarding. Learned essential survival skills that I'll remember for life. The instructors were knowledgeable and patient. The overnight solo experience pushed me beyond my comfort zone in the best way possible.",
    date: "2023-07-22"
  },
  {
    id: 3,
    name: "Artisan Pottery Workshop",
    image: "pottery.jpg",
    reviewed: false,
    rating: null,
    review: null,
    date: "2023-09-10"
  },
  {
    id: 4,
    name: "Deep Sea Diving Expedition",
    image: "diving.jpg",
    reviewed: false,
    rating: null,
    review: null,
    date: "2023-08-05"
  }
];

function Reviews() {
  const { token } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1070);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
    hoverRating: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1070);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setExperiences(mockExperiences);
      setLoading(false);
    }, 800);
  }, [token]);

  const reviewedExperiences = experiences.filter(exp => exp.reviewed);
  const notReviewedExperiences = experiences.filter(exp => !exp.reviewed);

  const getFilteredExperiences = () => {
    if (activeTab === 'reviewed') return reviewedExperiences;
    if (activeTab === 'not-reviewed') return notReviewedExperiences;
    return experiences;
  };

  const openReview = (review) => {
    setSelectedReview(review);
    document.body.style.overflow = 'hidden';
  };

  const closeReview = () => {
    setSelectedReview(null);
    document.body.style.overflow = 'auto';
  };

  const openReviewForm = (experience) => {
    setCurrentExperience(experience);
    setShowReviewForm(true);
    document.body.style.overflow = 'hidden';
  };

  const closeReviewForm = () => {
    setShowReviewForm(false);
    document.body.style.overflow = 'auto';
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleHoverRating = (rating) => {
    setFormData({ ...formData, hoverRating: rating });
  };

  const handleReviewChange = (e) => {
    setFormData({ ...formData, review: e.target.value });
  };

  const submitReview = () => {
    // Here you would typically make an API call to submit the review
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === currentExperience.id) {
        return {
          ...exp,
          reviewed: true,
          rating: formData.rating,
          review: formData.review,
          date: new Date().toISOString().split('T')[0]
        };
      }
      return exp;
    });
    
    setExperiences(updatedExperiences);
    setShowReviewForm(false);
    setFormData({ rating: 0, review: '', hoverRating: 0 });
  };

  const renderStars = (rating, interactive = false, size = '1.2rem') => {
    return Array(5).fill(0).map((_, i) => (
      <FontAwesomeIcon 
        key={i} 
        icon={faStar} 
        className={
          i < (interactive ? (formData.hoverRating || formData.rating) : rating) ? 
          "star-filled" : "star-empty"
        } 
        style={{ fontSize: size }}
        onClick={interactive ? () => handleRatingChange(i + 1) : undefined}
        onMouseEnter={interactive ? () => handleHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => handleHoverRating(0) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="spinner">
          {[...Array(8)].map((_, i) => <div key={i}></div>)}
        </div>
        <p>Loading your adventure memories...</p>
      </div>
    );
  }

  return (
    <div className="reviews-contain">
      <motion.div 
        className="reviews-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Your Experience Journal</h1>
        <p>Relive your adventures and share your stories</p>
      </motion.div>

      <div className="reviews-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Experiences
        </button>
        <button 
          className={activeTab === 'reviewed' ? 'active' : ''}
          onClick={() => setActiveTab('reviewed')}
        >
          Reviewed
        </button>
        <button 
          className={activeTab === 'not-reviewed' ? 'active' : ''}
          onClick={() => setActiveTab('not-reviewed')}
        >
          To Review
        </button>
      </div>

      <motion.div 
        className="reviews-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {getFilteredExperiences().map(experience => (
          <motion.div
            key={experience.id}
            className={`review-card ${experience.reviewed ? 'reviewed' : 'not-reviewed'}`}
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
          >
            <div className="card-image" style={{ backgroundImage: `url(${experience.image})` }}></div>
            
            <div className="card-content">
              <h3>{experience.name}</h3>
              <p className="experience-date">Experienced on: {experience.date}</p>
              
              {experience.reviewed ? (
                <>
                  <div className="rating-container">
                    {renderStars(experience.rating)}
                  </div>
                  <p className="review-excerpt">
                    {experience.review.substring(0, 100)}...
                  </p>
                  <button 
                    className="see-review-btn"
                    onClick={() => openReview(experience)}
                  >
                    See Full Review <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              ) : (
                <>
                  <p className="encouragement-text">
                    <span className="highlight">Share your adventure!</span> Your insights help others discover amazing experiences.
                  </p>
                  <div className="pulse-animation">
                    <motion.button
                      className="write-review-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openReviewForm(experience)}
                    >
                      <FontAwesomeIcon icon={faPencil} /> Write Review
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedReview && (
          <motion.div
            className="review-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <button className="close-modal" onClick={closeReview}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              
              <div 
                className="modal-hero"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${selectedReview.image})` }}
              >
                <h2>{selectedReview.name}</h2>
                <div className="hero-rating">
                  {renderStars(selectedReview.rating)}
                  <span>{selectedReview.rating}/5 Stars</span>
                </div>
                <p className="review-date">Reviewed on: {selectedReview.date}</p>
              </div>
              
              <div className="modal-body">
                <h3>Your Experience</h3>
                <p className="full-review">{selectedReview.review}</p>
                
                <div className="signature">
                  <p>Adventure Journal Entry</p>
                  <div className="signature-line"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewForm && currentExperience && (
          <motion.div
            className="review-form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="form-modal-content"
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <button className="close-modal" onClick={closeReviewForm}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              
              <div 
                className="form-modal-hero"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${currentExperience.image})` }}
              >
                <h2>Review Your {currentExperience.name} Experience</h2>
                <p className="review-date">Experienced on: {currentExperience.date}</p>
              </div>
              
              <div className="form-modal-body">
                <div className="rating-section">
                  <h3>How would you rate this experience?</h3>
                  <p className="rating-text">
                      {formData.rating > 0 ? 
                        `${formData.rating} Star${formData.rating > 1 ? 's' : ''}` : 
                        'Select your rating'}
                    </p>
                  <div className="interactive-rating">
                    {renderStars(0, true, '2rem')}
                  </div>
                </div>
                
                <div className="review-text-section">
                  <h3>Share your experience</h3>
                  <textarea
                    placeholder="Tell us about your adventure... What did you love? What could be improved?"
                    value={formData.review}
                    onChange={handleReviewChange}
                    className="review-textarea"
                  />
                  <p className="character-count">{formData.review.length}/500</p>
                </div>
                
                <button 
                  className="submit-review-btn"
                  onClick={submitReview}
                  disabled={formData.rating === 0 || formData.review.length < 20}
                >
                  Submit Your Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reviews;