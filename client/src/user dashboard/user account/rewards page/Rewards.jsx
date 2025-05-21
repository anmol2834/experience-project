import { motion } from 'framer-motion';
import { FiArrowLeft, FiZap, FiGift, FiAward, FiActivity } from 'react-icons/fi';
import './Rewards.css';

const Rewards = ({ isMobile, handleBack }) => {
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
                    <h3><FiActivity /> Recent Adventures</h3>
                    <div className="feed-list">
                        {[
                            { icon: '🪂', name: 'Skydiving', xp: 500, date: '2023-08-15' },
                            { icon: '🧗', name: 'Rock Climbing', xp: 300, date: '2023-08-14' },
                            { icon: '🏕️', name: 'Wilderness Survival', xp: 450, date: '2023-08-13' }
                        ].map((activity, index) => (
                            <div key={index} className="feed-item">
                                <div className="activity-icon">{activity.icon}</div>
                                <div className="activity-info">
                                    <h4>{activity.name}</h4>
                                    <span>{activity.date}</span>
                                </div>
                                <div className="xp-gain">+{activity.xp} XP</div>
                            </div>
                        ))}
                    </div>
                        <button className='view-more'>more</button>
                </div>

                <div className="experience-gallery">
                    <h3>Available Adventures</h3>
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