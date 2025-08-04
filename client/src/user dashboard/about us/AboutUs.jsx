import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aboutus-visible');
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.aboutus-animate-in');
      elements.forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  const experiences = [
    { title: "FPV Drone", icon: "🚁", delay: 0, desc: "First-person view drone racing experience" },
    { title: "Story Session", icon: "📖", delay: 0.2, desc: "Interactive horror and experience storytelling" },
    { title: "Late Night Party", icon: "🎉", delay: 0.6, desc: "Energetic parties with immersive themes" },
    { title: "Gamer Bash", icon: "🎮", delay: 0.8, desc: "Competitive gaming tournaments and VR experiences" },
    { title: "Wisdom Hour", icon: "🧠", delay: 1, desc: "Wisdom Hour lets you learn real-world skills and insights from experts in just one powerful hour" }
  ];

  return (
    <section className="aboutus-section" ref={sectionRef}>
      <button
        className="aboutus-back-btn"
        onClick={() => navigate("/home")}
      >
        <FontAwesomeIcon icon={faLongArrowLeft} /> Back to Home
      </button>

      <div className="aboutus-container">
        <div className="aboutus-header-group">
          <h1 className="aboutus-title aboutus-animate-in">About <span className="aboutus-highlight">Us</span></h1>
          <div className="aboutus-divider aboutus-animate-in" style={{ animationDelay: "0.3s" }}></div>
          <h2 className="aboutus-subtitle aboutus-animate-in" style={{ animationDelay: "0.5s" }}>
            Where <span className="aboutus-glowing-text">Extraordinary</span> Experiences Begin
          </h2>
        </div>

        <div className="aboutus-content">
          <div className="aboutus-description-container aboutus-animate-in" style={{ animationDelay: "0.7s" }}>
            <div className="aboutus-ornament aboutus-ornament-left">✧</div>
            <p className="aboutus-description">
              Welcome to <span className="aboutus-accent">Wandercall</span>, where we transform ordinary moments into
              <span className="aboutus-highlight"> unforgettable experiences</span>. We're pioneers in crafting unique
              experiences that push boundaries and ignite your senses. a space where real stories, shared passions, 
              and human connections come alive. We craft unforgettable moments with people you’ve never met, but will never forget.
            </p>
            <div className="aboutus-ornament aboutus-ornament-right">✧</div>
          </div>

          <div className="aboutus-features">
            <div className="aboutus-feature-text aboutus-animate-in" style={{ animationDelay: "1.1s" }}>
              <h3>Currently <span className="aboutus-glowing-text">Launching</span></h3>
              <p className="aboutus-feature-subtext">Our first wave of mind-bending experiences:</p>
            </div>

            <div className="aboutus-experience-grid">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="aboutus-experience-card aboutus-animate-in"
                  style={{ animationDelay: `${1.3 + exp.delay}s` }}
                >
                  <div className="aboutus-card-icon">{exp.icon}</div>
                  <h4 className="aboutus-card-title">{exp.title}</h4>
                  <p className="aboutus-card-desc">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="aboutus-future-section aboutus-animate-in" style={{ animationDelay: "2.1s" }}>
            <div className="aboutus-section-header">
              <h3>The <span className="aboutus-glowing-text">Future</span> of experience</h3>
              <div className="aboutus-stars">
                <span className="aboutus-star">✦</span>
                <span className="aboutus-star">✦</span>
                <span className="aboutus-star">✦</span>
              </div>
            </div>
            <p className="aboutus-future-text">
              We're just getting started. Soon, you'll be able to:
              <span className="aboutus-rainbow-text"> sky dive </span>
              through virtual realms,
              <span className="aboutus-rainbow-text"> bungee jump </span>
              into alternate dimensions,
              <span className="aboutus-rainbow-text"> craft </span>
              reality-bending artifacts, and test your survival skills in
              <span className="aboutus-highlight"> extreme environments</span>.
              The impossible becomes possible at Wandercall.
            </p>
            <div className="aboutus-timeline">
              <div className="aboutus-timeline-dot"></div>
              <div className="aboutus-timeline-dot"></div>
              <div className="aboutus-timeline-dot"></div>
            </div>
          </div>

          <div className="aboutus-closing aboutus-animate-in" style={{ animationDelay: "2.5s" }}>
            <p className="aboutus-closing-text">
              Join us on this journey where every event is a story, every moment is a memory, and
              <span className="aboutus-accent"> every experience defies expectations</span>.
            </p>
          </div>
        </div>

        <div className="aboutus-footer">
          <div className="aboutus-contact">
            <p>Ready for an experience?</p>
            <button className="aboutus-contact-btn">Contact Us</button>
          </div>
        </div>
      </div>

      <div className="aboutus-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="aboutus-particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${0.5 + Math.random()})`
          }}></div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;