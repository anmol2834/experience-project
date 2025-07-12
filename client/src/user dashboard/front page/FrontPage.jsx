import { useState, useEffect, useRef } from 'react';
import './frontpage.css';
import slide1 from './slide1.jpg';
import slide2 from './slide2.jpg';
import slide3 from './slide3.jpg';
import slide4 from './slide4.jpg';
import wandercall from './wandercall-logo1.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HomePage from '../home page/HomePage';
import MenuBar from '../menu-bar/MenuBar';
import Footer from '../../components/footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const slides = [slide1, slide2, slide3, slide4];

const FrontPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const homePageRef = useRef(null);

  useEffect(() => {
    const scrollToProductId = location.state?.scrollToProductId;
    const fallbackScrollPosition = location.state?.fallbackScrollPosition || 0;

    const scrollToTarget = () => {
      if (scrollToProductId) {
        const targetCard = document.querySelector(`[data-product-id="${scrollToProductId}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: fallbackScrollPosition, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: fallbackScrollPosition, behavior: 'smooth' });
      }
    };

    if (scrollToProductId || fallbackScrollPosition) {
      setTimeout(scrollToTarget, 500); // Delay to ensure DOM is fully rendered
      navigate('/', { replace: true, state: {} }); // Clear state after scrolling
    }
  }, [location, navigate]);

  useEffect(() => {
    const preloadImages = slides.map((slide) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = slide;
        img.onload = resolve;
      });
    });

    Promise.all(preloadImages).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const getSlideStyle = (index) => {
    const offset = (index - currentIndex + slides.length) % slides.length;

    if (offset === 0) {
      return { transform: 'translateX(0) scale(1)', opacity: 1, zIndex: 2 };
    } else if (offset === slides.length - 1) {
      return { transform: 'translateX(-100%) scale(0.8)', opacity: 0, zIndex: 1 };
    } else if (offset === 1) {
      return { transform: 'translateX(100%) scale(0.8)', opacity: 0, zIndex: 1 };
    } else {
      return { display: 'none' };
    }
  };

  const handleExploreClick = () => {
    if (homePageRef.current) {
      homePageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="front-contain">
      <div className="headers">
        <div className="logo">
          <img src={wandercall} alt="wandercall logo" />
        </div>
        <div className="app-info-menu">
          <span>Experience</span>
          <span onClick={() => navigate('/aboutus')}>About Us</span>
          <span onClick={() => navigate('/termsAndConditions')}>Terms and Conditions</span>
        </div>
        <div className="header-btn">
          {token ? (
            <span
              style={{ display: 'block' }}
              className="user-icon"
              onClick={() => navigate('/account')}
            >
              <FontAwesomeIcon icon={faUser} />
            </span>
          ) : (
            <>
              <button className="sign-btn signin" onClick={() => navigate('/signin')}>
                sign in
              </button>
              <button className="sign-btn signup" onClick={() => navigate('/signup')}>
                sign up
              </button>
            </>
          )}
        </div>
      </div>
      <div className="slideshow-container">
        <div className="slides-wrapper">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className="slide"
              style={getSlideStyle(index)}
            />
          ))}
          <button className="explore" onClick={handleExploreClick}>
            <span>explore</span>
          </button>
        </div>
        <div className="dots-container">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
        </div>
      </div>
      <div className="homepage" ref={homePageRef}>
        <HomePage />
      </div>
      <div>
        <Footer homeRef={homePageRef} />
      </div>
      <div>
        <MenuBar />
      </div>
    </div>
  );
};

export default FrontPage;