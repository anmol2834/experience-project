import { useState } from 'react';
import { motion } from 'framer-motion';
import './HelpCenter.css';

const HelpCenter = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({ email: '', message: '' })

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "Visit the profile edit page and click 'Change Password'"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayTm, GooglePay, PhonePe, and Cash On Visit"
    },
    {
      question: "How long does it takes to visit experience playground?",
      answer: "Standard visiting time takes 1-2 business days. Express options available at checkout"
    }
  ];

  const contactMethods = [
    { icon: '📧', title: 'Email', info: 'anmolsinha4321@gmail.com', action: 'Write to Us' },
    { icon: '💬', title: 'Live Chat', info: 'Available 24/7', action: 'Start Chat' },
    { icon: '📞', title: 'Phone', info: '+91 8733942557', action: 'Call Now' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <motion.div 
      className="help-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="help-title">How can we help you?</h1>
      
      <div className="contact-grid">
        {contactMethods.map((method, index) => (
          <div key={index} className="contact-card">
            <div className="contact-icon">{method.icon}</div>
            <h3>{method.title}</h3>
            <p>{method.info}</p>
            <button className="contact-action">
              {method.action} →
            </button>
          </div>
        ))}
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <div className="faq-question">
                {item.question}
                <span className="toggle-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              {activeIndex === index && (
                <motion.div 
                  className="faq-answer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form className="support-form" onSubmit={handleSubmit}>
        <h2>Direct Support Request</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Describe your issue..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows="4"
            required
          />
        </div>
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send Message
        </motion.button>
      </form>
    </motion.div>
  );
};

export default HelpCenter;