import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiZap, FiGift, FiAward, FiActivity } from 'react-icons/fi';
import './Rewards.css';

const allActivities = [
  { icon: '🪂', name: 'Skydiving', xp: 500, date: '2023-08-15' },
  { icon: '🧗', name: 'Rock Climbing', xp: 300, date: '2023-08-14' },
  { icon: '🏕️', name: 'Wilderness Survival', xp: 450, date: '2023-08-13' },
  { icon: '🚣', name: 'Kayaking', xp: 400, date: '2023-08-12' },
  { icon: '🏂', name: 'Snowboarding', xp: 550, date: '2023-08-11' },
  { icon: '🚴', name: 'Mountain Biking', xp: 350, date: '2023-08-10' },
];

const Rewards = ({ isMobile, handleBack }) => {
  const [activityPage, setActivityPage] = useState(0);
  const currentActivities = allActivities.slice(activityPage * 3, (activityPage * 3) + 3);

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
              <h2>1,731</h2>
              <div className="progress-contain">
                <div className="progress-bar" style={{ width: '65%' }} />
              </div>
              <span className="progress-text">65% to next level</span>
            </div>
            <div className="xp-badge">
              <FiAward size={40} />
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
          </div>
          <div className="activity-navigation">
            {activityPage > 0 && (
              <button className="view-more" onClick={() => setActivityPage(prev => prev - 1)}>Previous</button>
            )}
            {(activityPage + 1) * 3 < allActivities.length && (
              <button className="view-more" onClick={() => setActivityPage(prev => prev + 1)}>See More</button>
            )}
          </div>
        </div>

        <div className="experience-gallery">
          <h3>Available Experience</h3>
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