import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiZap, FiGift, FiAward, FiActivity } from 'react-icons/fi';
import './Rewards.css';

const Rewards = ({ isMobile, handleBack }) => {
  const [allActivities, setAllActivities] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [activityPage, setActivityPage] = useState(0);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAllActivities(data.xpHistory || []);
        setTotalXP(data.xp || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const currentActivities = allActivities.slice(activityPage * 3, (activityPage * 3) + 3);
  
  // Calculate progress percentage and level based on total XP
  const levelThreshold = 3000;
  const currentLevel = Math.floor(totalXP / levelThreshold) + 1;
  const progressPercentage = Math.min(Math.floor(((totalXP % levelThreshold) / levelThreshold) * 100), 100);
  
  return (
    <div className="rewards-container">
      {isMobile && (
        <div className="mobile-back-button" onClick={handleBack}>
          <FiArrowLeft size={30} color="#fff" />
        </div>
      )}

      <motion.div
        className="rewards-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="rewards-header">
          <h1>Experience Rewards</h1>
          <div className="xp-card">
            <div className="xp-details">
              <span className="label">Total XP</span>
              <h2>{totalXP.toLocaleString()}</h2>
              <div className="reward-progress-container">
                <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
              </div>
              <span className="progress-text">{progressPercentage}% to next level</span>
            </div>
            <div className="xp-badge">
              <FiAward size={40} />
              <p>lvl. {currentLevel}</p>
            </div>
          </div>
        </div>

        <div className="action-grid">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="action-card redeem-card"
          >
            <FiZap size={24} />
            <span>Redeem XP</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="action-card earn-card"
          >
            <FiGift size={24} />
            <span>Earn More</span>
          </motion.button>
        </div>

        <div className="adventure-feed">
          <h3><FiActivity /> Recent Experience</h3>
          <div className="feed-list">
            {allActivities.length > 0 ? (
              <AnimatePresence initial={false} key={activityPage}>
                {currentActivities.map((activity) => (
                  <motion.div
                    key={activity.name}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="feed-item"
                  >
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-info">
                      <h4>{activity.name}</h4>
                      <span>{activity.date}</span>
                    </div>
                    <div className="xp-gain">+{activity.xp} XP</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="empty-experience">
                <div className="empty-illustration">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path d="M13.5 3C13.5 2.17157 12.8284 1.5 12 1.5C11.1716 1.5 10.5 2.17157 10.5 3H13.5ZM10.5 5C10.5 5.82843 11.1716 6.5 12 6.5C12.8284 6.5 13.5 5.82843 13.5 5H10.5ZM12 8.5C10.6193 8.5 9.5 9.61929 9.5 11C9.5 12.3807 10.6193 13.5 12 13.5C13.3807 13.5 14.5 12.3807 14.5 11C14.5 9.61929 13.3807 8.5 12 8.5ZM3 11C3 6.58172 6.58172 3 11 3V1.5C5.75329 1.5 1.5 5.75329 1.5 11H3ZM11 19C6.58172 19 3 15.4183 3 11H1.5C1.5 16.2467 5.75329 20.5 11 20.5V19ZM19 11C19 15.4183 15.4183 19 11 19V20.5C16.2467 20.5 20.5 16.2467 20.5 11H19ZM11 3C15.4183 3 19 6.58172 19 11H20.5C20.5 5.75329 16.2467 1.5 11 1.5V3ZM10.5 3V5H13.5V3H10.5Z" 
                          fill="url(#emptyGradient)"/>
                    <defs>
                      <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6a5acd" />
                        <stop offset="100%" stopColor="#ff694e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h4>No Experience Yet</h4>
                <p>Complete experiences to earn XP and unlock rewards!</p>
              </div>
            )}
          </div>
          
          {allActivities.length > 0 && (
            <div className="activity-navigation">
              {activityPage > 0 && (
                <button className="view-more" onClick={() => setActivityPage(prev => prev - 1)}>Previous</button>
              )}
              {(activityPage + 1) * 3 < allActivities.length && (
                <button className="view-more" onClick={() => setActivityPage(prev => prev + 1)}>See More</button>
              )}
            </div>
          )}
        </div>

        <div className="experience-gallery">
          <h3>Upcoming Experiences</h3>
          <div className="gallery-grid">
            {[
              { title: 'Mountain Trek', xp: 1500, image: 'https://wittypen.com/blog/wp-content/uploads/2017/08/Trekking-the-himalayas.webp' },
              { title: 'Cave Diving', xp: 2000, image: 'https://divermag.com/wp-content/uploads/2022/03/DSC0199NWM-color.jpg' },
              { title: 'Desert Safari', xp: 1800, image: 'https://blog-content.ixigo.com/wp-content/uploads/2016/09/shutterstock_115589698.jpg' }
            ].map((exp, index) => (
              <div
                key={index}
                className="experience-card"
                style={{ backgroundImage: `url(${exp.image})` }}
              >
                <div className="experience-overlay">
                  <h4>{exp.title}</h4>
                  <div className="xp-requirement">{exp.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Rewards;