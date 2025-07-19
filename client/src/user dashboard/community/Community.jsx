// src/components/Community/Community.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Community.css';

const Community = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Community features data
  const communityFeatures = [
    {
      title: "Real-time Group Chats",
      description: "Create or join topic-based chat rooms for instant discussions with fellow enthusiasts.",
      icon: "💬",
      color: "#ff00ff"
    },
    {
      title: "Experience Sharing Hub",
      description: "Share your experience stories, photos, and videos with our passionate community.",
      icon: "📸",
      color: "#6a5acd"
    },
    {
      title: "Event Coordination",
      description: "Organize and join local experience, meetups, and virtual gatherings with ease.",
      icon: "🗓️",
      color: "#8a2be2"
    },
    {
      title: "Expert Q&A Sessions",
      description: "Connect with industry experts and get your questions answered in live sessions.",
      icon: "🎓",
      color: "#00ffff"
    },
    {
      title: "Achievement Badges",
      description: "Earn recognition for your contributions and participation in the community.",
      icon: "🏆",
      color: "#ff9900"
    },
    {
      title: "Personalized Feed",
      description: "Get customized content based on your interests and activity.",
      icon: "📱",
      color: "#ff1493"
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % communityFeatures.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [communityFeatures.length]);

  return (
    <div className="community-main-container">
      {/* Animated background elements */}
      <div className="community-neon-grid"></div>
      
      {/* Back button */}
      <button className="community-back-button" onClick={() => navigate(-1)}>
        <span className="community-back-arrow">←</span> Back
      </button>

      <div className="community-content-wrapper">
        {/* Main heading with animation */}
        <div className="community-heading-container">
          <h1 className="community-neon-title">Community</h1>
          <h2 className="community-neon-subtitle">Coming Soon</h2>
          <div className="community-neon-divider"></div>
          <p className="community-neon-description">
            We're building an exclusive space where experiencers connect, share experiences, 
            and build lasting connections. Get ready to join fellow thrill-seekers in our 
            vibrant community.
          </p>
        </div>
        
        {/* Features showcase */}
        <div className="community-features-section">
          <div className="community-features-visual">
            <div className="community-visual-container">
              <div className="community-feature-circle">
                {communityFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className={`community-feature-icon ${index === activeFeature ? 'community-active' : ''}`}
                    style={{
                      transform: `rotate(${index * 60}deg) translate(200px) rotate(-${index * 60}deg)`,
                      color: feature.color
                    }}
                  >
                    <div className="community-icon-bg">
                      <span>{feature.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="community-active-feature-card">
                <div className="community-feature-icon-large">{communityFeatures[activeFeature].icon}</div>
                <h3>{communityFeatures[activeFeature].title}</h3>
                <p>{communityFeatures[activeFeature].description}</p>
              </div>
            </div>
          </div>
          
          <div className="community-features-grid">
            {communityFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`community-feature-card ${index === activeFeature ? 'community-active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="community-feature-icon-small" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
        
        {/* Advantages section */}
        <div className="community-advantages-section">
          <h2 className="community-section-title">Why Join Our <span>Community</span>?</h2>
          
          <div className="community-advantages-grid">
            <div className="community-advantage-card">
              <div className="community-advantage-icon">🤝</div>
              <h3>Connect with Like-Minded People</h3>
              <p>Find others who share your passion for experience and unique experiences.</p>
            </div>
            
            <div className="community-advantage-card">
              <div className="community-advantage-icon">💡</div>
              <h3>Gain Exclusive Insights</h3>
              <p>Access expert advice and insider knowledge to enhance your experiences.</p>
            </div>
            
            <div className="community-advantage-card">
              <div className="community-advantage-icon">🚀</div>
              <h3>Early Access to experience</h3>
              <p>Be the first to know about upcoming experiences and get priority booking.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="community-particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="community-particle" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              background: `hsl(${Math.random() * 360}, 100%, 70%)`
            }}
          ></div>
        ))}
      </div>
      
      <div className="community-neon-footer">
        <p>Experience the extraordinary • Connecting experiencers worldwide</p>
      </div>
    </div>
  );
};

export default Community;