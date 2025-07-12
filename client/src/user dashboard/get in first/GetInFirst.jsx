import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './GetInFirst.css';

function GetInFirst() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [joinCount, setJoinCount] = useState(0);
  const containerRef = useRef(null);
  const [progressWidth, setProgressWidth] = useState('33%');
  const navigate = useNavigate();

  // Refs for input auto-focus
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  // Fetch waitlist count on mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/waitlist/count`)
      .then(res => res.json())
      .then(data => setJoinCount(data.count))
      .catch(err => console.error('Error fetching waitlist count:', err));
  }, []);

  // Set focus to first input when step changes
  useEffect(() => {
    if (step === 1 && nameRef.current) {
      nameRef.current.focus();
      setTimeout(() => {
        nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
    if (step === 2 && emailRef.current) {
      emailRef.current.focus();
      setTimeout(() => {
        emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [step]);

  // Animation for step transitions
  useEffect(() => {
    if (step === 1) setProgressWidth('33%');
    if (step === 2) setProgressWidth('66%');
    if (step === 3) setProgressWidth('100%');
  }, [step]);

  // Confetti animation for success
  useEffect(() => {
    if (step === 3) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 13) newErrors.age = 'You must be at least 13 years old';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number (10 digits)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/waitlist/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          setStep(3);
          setJoinCount(prev => prev + 1);
        } else {
          const errorData = await response.json();
          setGeneralError(errorData.message || 'Failed to join waitlist');
        }
      } catch (err) {
        setGeneralError('Server error, please try again later');
        console.error('Error submitting form:', err);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    if (step === 1) {
      navigate(-1);
    }
  };

  // Share functions
  const shareOnInstagram = () => {
    alert("Sharing on Instagram! In a real app, this would open the Instagram share dialog.");
  };

  const shareOnWhatsApp = () => {
    alert("Sharing on WhatsApp! In a real app, this would open the WhatsApp share dialog.");
  };

  return (
    <div className="get-in-first-container" ref={containerRef}>
      {/* Confetti overlay - only shown after submission */}
      {showConfetti && (
        <div className="confetti-overlay">
          <div className="confetti-message">
            <h1 className="congratulations">Congratulations!</h1>
            <p className="subtitle">You're officially a founding member</p>
          </div>
          {[...Array(150)].map((_, i) => (
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                transform: `scale(${Math.random() * 0.8 + 0.2})`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Back button - visible on all steps except the last one */}
      {step !== 3 && (
        <button className="back-button" onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back
        </button>
      )}
      
      {/* Progress bar with animation */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: progressWidth }}></div>
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}></div>
        </div>
      </div>
      
      {/* Step 1: Name and Age */}
      {step === 1 && (
        <div className="step-content animate-in">
          <div className="header-section">
            <h1 className="neon-heading">Join the <span className="highlight">Exclusive</span> Waiting List</h1>
            <p className="subtitle">Be among the first to experience our revolutionary adventure platform</p>
          </div>
          
          <div className="content-grid">
            <div className="left-column">
              <div className="info-card">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-1v6l4.25 2.52.75-1.23-3.5-2.09V7z"/>
                  </svg>
                </div>
                <div className="card-content">
                  <h3>Why Join Now?</h3>
                  <p>As an early member, you'll receive exclusive benefits that later users won't have access to. We're building the future of experiential entertainment, and you have a chance to be at the forefront.</p>
                </div>
              </div>
              
              <div className="benefits-grid">
                <div className="benefit-card animate-delay-1">
                  <div className="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                  </div>
                  <h4>Priority Access</h4>
                  <p>Be first in line for new experiences as they launch</p>
                </div>
                
                <div className="benefit-card animate-delay-2">
                  <div className="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                    </svg>
                  </div>
                  <h4>Exclusive Rewards</h4>
                  <p>Special gifts and discounts only for founding members</p>
                </div>
              </div>
            </div>
            
            <div className="right-column">
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter your full name"
                    autoFocus
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={errors.age ? 'error' : ''}
                    placeholder="Enter your age"
                    min="13"
                  />
                  {errors.age && <span className="error-message">{errors.age}</span>}
                </div>
              </div>
              
              <div className="stats-container">
                <div className="stat-card animate-delay-1">
                  <div className="stat-value">{joinCount.toLocaleString()}</div>
                  <div className="stat-label">Members Joined</div>
                </div>
                
                <div className="stat-card animate-delay-2">
                  <div className="stat-value">24</div>
                  <div className="stat-label">Hours Remaining</div>
                </div>
              </div>
              
              <div className="action-section">
                <button className="next-button animate-pop" onClick={handleNext}>
                  Secure Your Spot
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
                
                <div className="disclaimer animate-fade-in">
                  <div className="warning-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                  </div>
                  <p>Limited spots available. Rewards are distributed based on registration order. Join now to secure your founding member benefits.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Email and Phone */}
      {step === 2 && (
        <div className="step-content animate-in">
          <div className="header-section">
            <h1 className="neon-heading">Complete Your <span className="highlight">Registration</span></h1>
            <p className="subtitle">Just one more step to unlock your exclusive founding member benefits</p>
          </div>
          
          <div className="content-grid">
            <div className="left-column">
              <div className="info-card">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                  </svg>
                </div>
                <div className="card-content">
                  <h3>Your Rewards Await</h3>
                  <p>As a founding member, you'll receive exclusive access to our launch events, special pricing on premium experiences.</p>
                </div>
              </div>
            </div>
            
            <div className="right-column">
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your.email@example.com"
                    autoFocus
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="8983745627"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                {generalError && <span className="error-message">{generalError}</span>}
              </div>
              
              <div className="warning-card animate-pop">
                <div className="warning-header">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <h3>Important Notice</h3>
                </div>
                <p>You must sign up with the same email and phone number to claim your rewards. Invalid entries will forfeit all benefits. Your information is secure and will only be used to deliver your rewards and updates about our launch.</p>
              </div>
              
              <div className="action-section">
                <button className="next-button animate-pop" onClick={handleNext}>
                  Claim Your Rewards
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 3: Success */}
      {step === 3 && (
        <div className="step-content animate-in">
          <div className="success-header">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h1 className="neon-heading">Welcome to the Club!</h1>
            <p className="subtitle">You're officially a founding member</p>
          </div>
          
          <div className="content-grid">
            <div className="left-column">
              <div className="position-card animate-pop">
                <h3>Your Exclusive Position</h3>
                <div className="position-number">#{joinCount}</div>
                <p>You're among the first <strong>1000</strong> founding members</p>
              </div>
              
              <div className="rewards-section">
                <h2 className="section-title">Your Founding Member Rewards</h2>
                
                <div className="rewards-grid">
                  <div className="reward-card animate-delay-1">
                    <div className="reward-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                      </svg>
                    </div>
                    <h4>10% Discount Voucher</h4>
                    <p>For your first 50 experience booking</p>
                  </div>
                  
                  <div className="reward-card animate-delay-2">
                    <div className="reward-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"/>
                      </svg>
                    </div>
                    <h4>Priority Access</h4>
                    <p>Early booking for all new experiences</p>
                  </div>
                  
                  <div className="reward-card animate-delay-3">
                    <div className="reward-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
                      </svg>
                    </div>
                    <h4>5000 Welcome XP</h4>
                    <p>Replace XP with awesome rewards</p>
                  </div>
                  
                  <div className="reward-card animate-delay-4">
                    <div className="reward-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <h4>VIP Member Events</h4>
                    <p>Exclusive invites to member-only gatherings</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="right-column">
              <div className="next-steps">
                <h2 className="section-title">What Happens Next</h2>
                
                <div className="timeline">
                  <div className="timeline-item animate-delay-1">
                    <div className="timeline-icon">1</div>
                    <div className="timeline-content">
                      <h4>Confirmation Email</h4>
                      <p>You'll receive a welcome email with your membership details within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item animate-delay-2">
                    <div className="timeline-icon">2</div>
                    <div className="timeline-content">
                      <h4>Reward Delivery</h4>
                      <p>Your discount voucher and digital welcome kit will be sent to your email</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item animate-delay-3">
                    <div className="timeline-icon">3</div>
                    <div className="timeline-content">
                      <h4>Launch Notification</h4>
                      <p>We'll notify you as soon as our platform is ready for your first adventure</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="community-section animate-fade-in">
                <h2 className="section-title">Share With Friends</h2>
                <p>Invite friends to join and earn extra rewards</p>
                
                <div className="social-links">
                  <button className="social-button animate-delay-1" onClick={shareOnInstagram}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                    Instagram
                  </button>
                  
                  <button className="social-button animate-delay-2" onClick={shareOnWhatsApp}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetInFirst;