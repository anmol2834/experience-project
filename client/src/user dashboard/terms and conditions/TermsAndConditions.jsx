import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndConditions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth(); 
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('.terms-section');
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight * 0.3) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`terms-container ${isVisible ? 'visible' : ''}`}>
      <button className='back-to-dashboard' onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faLongArrowLeft} />
      </button>
      <div className="terms-header">
        <h1 className="terms-title">Terms & Conditions</h1>
        <div className="glowing-divider"></div>
        <p className="terms-subtitle">
          Last updated: June 14, 2025
        </p>
      </div>
      
      <div className="terms-content">
        <div className="terms-nav">
          <h3>Quick Navigation</h3>
          <div className="nav-items-container">
            <div className="nav-item">
              <a href="#introduction" className={activeSection === 'introduction' ? 'active' : ''}>Introduction</a>
            </div>
            <div className="nav-item">
              <a href="#accounts" className={activeSection === 'accounts' ? 'active' : ''}>Accounts</a>
            </div>
            <div className="nav-item">
              <a href="#bookings" className={activeSection === 'bookings' ? 'active' : ''}>Bookings & Payments</a>
            </div>
            <div className="nav-item">
              <a href="#liability" className={activeSection === 'liability' ? 'active' : ''}>Liability & Waivers</a>
            </div>
            <div className="nav-item">
              <a href="#cancellations" className={activeSection === 'cancellations' ? 'active' : ''}>Cancellations</a>
            </div>
            <div className="nav-item">
              <a href="#conduct" className={activeSection === 'conduct' ? 'active' : ''}>User Conduct</a>
            </div>
            <div className="nav-item">
              <a href="#intellectual" className={activeSection === 'intellectual' ? 'active' : ''}>Intellectual Property</a>
            </div>
            <div className="nav-item">
              <a href="#privacy" className={activeSection === 'privacy' ? 'active' : ''}>Privacy</a>
            </div>
          </div>
        </div>
        
        <div className="terms-sections">
          <section id="introduction" className="terms-section">
            <h2>1. Introduction</h2>
            <p>Welcome to WanderCall! These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services.</p>
            
            <p>WanderCall provides unique experiential services including but not limited to FPV drone experiences, story nights, movie nights, late night parties, gamer bashes, and other immersive activities ("Experiences"). Our mission is to create unforgettable moments through carefully curated experiences.</p>
            
            <p>These Terms constitute a legally binding agreement between you ("User", "Participant", or "you") and WanderCall ("Company", "we", "us", or "our"). We reserve the right to modify these Terms at any time, with changes becoming effective immediately upon posting on our platform. Your continued use of our services after such changes constitutes your acceptance of the revised Terms.</p>
          </section>
          
          <section id="accounts" className="terms-section">
            <h2>2. User Accounts</h2>
            <p>To access certain features of our services, you must create an account. When creating your account, you agree to provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            
            <p>You must be at least 16 years old to create an account and participate in our Experiences. For participants between 13-15 years old, a parent or legal guardian must create the account and provide consent for participation. We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</p>
            
            <p>By creating an account, you consent to receive electronic communications from WanderCall, including booking confirmations, experience updates, promotional offers, and important service announcements. You may opt-out of promotional communications at any time through your account settings.</p>
          </section>
          
          <section id="bookings" className="terms-section">
            <h2>3. Bookings & Payments</h2>
            <p>All bookings for Experiences are subject to availability. When you book an Experience, you agree to pay the specified price plus any applicable taxes and fees. Prices are subject to change without notice, but changes will not affect bookings already confirmed.</p>
            
            <p>We accept various payment methods including credit/debit cards, digital wallets, and other payment options displayed during checkout. By providing payment information, you represent that you are authorized to use the payment method.</p>
            
            <p>For certain high-risk Experiences, we may require a signed liability waiver before participation. Failure to complete required waivers may result in cancellation of your booking without refund.</p>
            
            <div className="highlight-box">
              <h3>Important Booking Information</h3>
              <div className="info-item">
                <div className="info-bullet">•</div>
                <div className="info-text">All bookings are confirmed via email immediately after payment</div>
              </div>
              <div className="info-item">
                <div className="info-bullet">•</div>
                <div className="info-text">Arrival at least 15 minutes before scheduled start time is required</div>
              </div>
              <div className="info-item">
                <div className="info-bullet">•</div>
                <div className="info-text">Late arrivals may result in denied participation without refund</div>
              </div>
              <div className="info-item">
                <div className="info-bullet">•</div>
                <div className="info-text">Specific requirements for each Experience are detailed in booking confirmation</div>
              </div>
            </div>
          </section>
          
          <section id="liability" className="terms-section">
            <h2>4. Liability & Waivers</h2>
            <p>Participation in WanderCall Experiences involves inherent risks. By booking an Experience, you acknowledge and voluntarily assume all risks associated with participation, including risk of injury, disability, death, or property damage.</p>
            
            <p>To the maximum extent permitted by law, WanderCall, its affiliates, employees, and partners shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your participation in any Experience.</p>
            
            <p>You agree to indemnify and hold harmless WanderCall from any claims, damages, liabilities, costs, and expenses (including legal fees) arising from your participation in any Experience or violation of these Terms.</p>
            
            <p>For certain Experiences, you may be required to sign additional liability waivers before participation. These waivers will be provided electronically before the Experience or in person at the venue.</p>
          </section>
          
          <section id="cancellations" className="terms-section">
            <h2>5. Cancellations & Refunds</h2>
            <p>Cancellation policies vary by Experience type. Standard cancellation terms are as follows:</p>
            
            <div className="policy-grid">
              <div className="policy-card">
                <div className="policy-icon">⏱️</div>
                <h3>Standard Experiences</h3>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellations made 48 hours or more before the experience starts are eligible for a full refund.</div>
                </div>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellations made within 48 hours of the start time are non-refundable.</div>
                </div>
              </div>
              
              {/* <div className="policy-card">
                <div className="policy-icon">🚁</div>
                <h3>Premium Experiences</h3>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellation 5+ days before experience: Full refund</div>
                </div>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellation 3-5 days before experience: 50% refund</div>
                </div>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellation less than 72 hours: No refund</div>
                </div>
              </div> */}
              
              {/* <div className="policy-card">
                <div className="policy-icon">🎟️</div>
                <h3>Special Events</h3>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellation 14+ days before: Full refund</div>
                </div>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellation 7-14 days before: 50% refund</div>
                </div>
                <div className="policy-item">
                  <div className="policy-bullet">-</div>
                  <div className="policy-text">Cancellation less than 7 days: No refund</div>
                </div>
              </div> */}
            </div>
            
            <p>WanderCall reserves the right to cancel any Experience due to weather conditions, safety concerns, insufficient bookings, or other unforeseen circumstances. In such cases, we will provide a full refund or offer to reschedule your booking.</p>
          </section>
          
          <section id="conduct" className="terms-section">
            <h2>6. User Conduct</h2>
            <p>During all WanderCall Experiences, participants are expected to behave respectfully toward staff, other participants, and venue property. We reserve the right to remove any participant whose behavior is disruptive, dangerous, or violates these Terms without refund.</p>
            
            <p>Prohibited behaviors include but are not limited to:</p>
            
            <div className="prohibited-container">
              <div className="prohibited-item">
                <div className="prohibited-icon">✖</div>
                <div className="prohibited-text">Harassment of staff or other participants</div>
              </div>
              <div className="prohibited-item">
                <div className="prohibited-icon">✖</div>
                <div className="prohibited-text">Damage to equipment or venues</div>
              </div>
              <div className="prohibited-item">
                <div className="prohibited-icon">✖</div>
                <div className="prohibited-text">Use of illegal substances</div>
              </div>
              <div className="prohibited-item">
                <div className="prohibited-icon">✖</div>
                <div className="prohibited-text">Excessive intoxication</div>
              </div>
              <div className="prohibited-item">
                <div className="prohibited-icon">✖</div>
                <div className="prohibited-text">Violation of safety instructions</div>
              </div>
              <div className="prohibited-item">
                <div className="prohibited-icon">✖</div>
                <div className="prohibited-text">Unauthorized photography/videography</div>
              </div>
            </div>
            
            <p>for riskful experiences specifically, participants must follow all safety instructions provided by our certified operators. Any reckless operation or violation of safety protocols will result in immediate termination of the session without refund.</p>
          </section>
          
          <section id="intellectual" className="terms-section">
            <h2>7. Intellectual Property</h2>
            <p>All content on the WanderCall platform, including text, graphics, logos, images, software, and Experience designs, is the property of WanderCall or its content suppliers and protected by intellectual property laws.</p>
            
            <p>By submitting any content (reviews, photos, videos, etc.) to WanderCall, you grant us a perpetual, royalty-free, worldwide license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any media.</p>
            
            <p>During Experiences, WanderCall may capture photos or videos for promotional purposes. By participating, you consent to such recording and its use in WanderCall marketing materials. If you prefer not to be photographed, please notify our staff before the Experience begins.</p>
          </section>
          
          <section id="privacy" className="terms-section">
            <h2>8. Privacy & Data Protection</h2>
            <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information and is incorporated into these Terms by reference.</p>
            
            <p>We collect information necessary to provide our services, including contact details, payment information, and health/accessibility requirements relevant to specific Experiences. We implement industry-standard security measures to protect your data but cannot guarantee absolute security.</p>
            
            <p>By using our services, you consent to the transfer and processing of your data as described in our Privacy Policy. We may disclose your information when required by law or to protect our rights, property, or safety.</p>
            
            <div className="privacy-highlight">
              <h3>Your Data Rights</h3>
              <p>You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at privacy@wandercall.com. Please allow up to 30 days for us to process your request.</p>
            </div>
          </section>
          
          <section className="terms-section">
            <h2>9. Governing Law & Disputes</h2>
            <p>These Terms shall be governed by the laws of the State of California without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our services will be resolved through binding arbitration in San Francisco, California, rather than in court.</p>
            
            <p>You and WanderCall agree that any arbitration will take place on an individual basis; class arbitrations and class actions are not permitted. The arbitrator's award may be entered in any court of competent jurisdiction.</p>
          </section>
          
          <section className="terms-section">
            <h2>10. Contact Information</h2>
            <p>For questions about these Terms or our services, please contact us:</p>
            
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">teamwandercall@gmail.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <span className="contact-value">+91 8733942557</span>
              </div>
              {/* <div className="contact-item">
                <span className="contact-label">Mail:</span>
                <span className="contact-value">WanderCall Inc., 123 Experience Lane, San Francisco, CA 94107</span>
              </div> */}
            </div>
          </section>
        </div>
      </div>
      
      <div className="terms-footer">
        <p>By using WanderCall services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
        {!token && ( // Show acceptance box only if user is not logged in
          <div className="acceptance-box" onClick={() => navigate('/signup?agree=true')}>
            <p>I agree to the Terms and Conditions and Privacy Policy</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsAndConditions;