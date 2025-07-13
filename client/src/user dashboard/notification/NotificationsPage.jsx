// src/components/NotificationsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css'; 

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    // {
    //   id: 1,
    //   title: "FPV Drone Experience Available",
    //   message: "Your booking for the FPV Drone Experience is confirmed for next Saturday at 2 PM.",
    //   time: "2 hours ago",
    //   read: false,
    //   type: "event"
    // },
    // {
    //   id: 2,
    //   title: "New Horror Story Session",
    //   message: "Join us tonight for a spine-chilling horror story session at midnight. Bring your friends!",
    //   time: "5 hours ago",
    //   read: false,
    //   type: "story"
    // },
    // {
    //   id: 3,
    //   title: "Movie Night Special",
    //   message: "This Friday's movie night will feature cult classics. Vote for your favorite now!",
    //   time: "1 day ago",
    //   read: true,
    //   type: "movie"
    // },
    // {
    //   id: 4,
    //   title: "Gamer Bash Registration Open",
    //   message: "Early bird registration for the next Gamer Bash tournament is now open. Limited spots available!",
    //   time: "1 day ago",
    //   read: false,
    //   type: "gaming"
    // },
    // {
    //   id: 5,
    //   title: "Wisdom Hours Guest Speaker",
    //   message: "Renowned philosopher Dr. Elena Rodriguez will be our guest at Wisdom Hours next week.",
    //   time: "2 days ago",
    //   read: true,
    //   type: "wisdom"
    // },
    // {
    //   id: 6,
    //   title: "Late Night Party Theme",
    //   message: "The theme for this month's late night party is 'Neon Dreams'. Start planning your outfits!",
    //   time: "3 days ago",
    //   read: true,
    //   type: "party"
    // },
    // {
    //   id: 7,
    //   title: "New Experience Coming Soon",
    //   message: "Our survival experience package will be available for booking starting next month.",
    //   time: "4 days ago",
    //   read: true,
    //   type: "update"
    // }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getIconForType = (type) => {
    switch(type) {
      case "event":
        return "🚁";
      case "story":
        return "📖";
      case "movie":
        return "🎬";
      case "gaming":
        return "🎮";
      case "wisdom":
        return "🧠";
      case "party":
        return "🎉";
      case "update":
        return "🚀";
      default:
        return "🔔";
    }
  };

  const getBgForType = (type) => {
    switch(type) {
      case "event":
        return "rgba(106, 90, 205, 0.15)";
      case "story":
        return "rgba(138, 43, 226, 0.15)";
      case "movie":
        return "rgba(255, 105, 78, 0.15)";
      case "gaming":
        return "rgba(255, 153, 0, 0.15)";
      case "wisdom":
        return "rgba(0, 219, 0, 0.15)";
      case "party":
        return "rgba(255, 0, 255, 0.15)";
      case "update":
        return "rgba(47, 116, 242, 0.15)";
      default:
        return "rgba(255, 255, 255, 0.1)";
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="notif-page-container">
      <div className="notif-header-section">
        <button 
          className="notif-back-button"
          onClick={handleGoBack}
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <h1 className="notif-main-heading">Notifications</h1>
        <div className="notif-header-spacer" /> {/* For alignment */}
      </div>
      
      <div className="notif-content-wrapper">
        {notifications.length === 0 ? (
          <div className="notif-empty-state">
            <div className="notif-empty-illustration">
              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="120" r="80" fill="rgba(106, 90, 205, 0.1)" stroke="var(--glow-secondary)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="200" cy="120" r="60" fill="rgba(106, 90, 205, 0.2)" stroke="var(--glow-secondary)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="200" cy="120" r="40" fill="rgba(106, 90, 205, 0.3)" stroke="var(--glow-secondary)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="200" cy="120" r="20" fill="var(--glow-secondary)" />
                <path d="M200,120 L200,200" stroke="var(--glow-secondary)" strokeWidth="2" />
                <path d="M200,200 L150,250" stroke="var(--glow-secondary)" strokeWidth="2" />
                <path d="M200,200 L250,250" stroke="var(--glow-secondary)" strokeWidth="2" />
                <circle cx="200" cy="120" r="5" fill="white" />
              </svg>
            </div>
            <h2 className="notif-empty-title">No notifications yet</h2>
            <p className="notif-empty-text">When you have notifications, they'll appear here</p>
          </div>
        ) : (
          <div className="notif-cards-grid">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`notif-card-item ${notification.read ? 'notif-read' : 'notif-unread'}`}
                style={{ background: getBgForType(notification.type) }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notif-icon-container">
                  <div className="notif-icon-circle">
                    {getIconForType(notification.type)}
                  </div>
                </div>
                <div className="notif-card-content">
                  <div className="notif-card-header">
                    <h3 className="notif-card-title">{notification.title}</h3>
                    {!notification.read && <span className="notif-unread-badge">New</span>}
                  </div>
                  <p className="notif-card-message">{notification.message}</p>
                  <div className="notif-card-footer">
                    <span className="notif-time-indicator">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;