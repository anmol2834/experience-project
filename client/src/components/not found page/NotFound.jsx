import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page-container">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button className="not-found-button" onClick={handleGoBack}>
          <span className="arrow">←</span> Go Back
        </button>
      </div>
    </div>
  );
}

export default NotFound;