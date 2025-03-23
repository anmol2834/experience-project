import { useState, useEffect, useRef } from 'react';
import './frontpage.css';
import exproLogo from '../../assets/exproLogo.png';
import slide1 from './slide1.jpg';
import slide2 from './slide2.jpg';
import slide3 from './slide3.jpg';
import slide4 from './slide4.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HomePage from '../home page/HomePage';
import MenuBar from '../menu-bar/MenuBar';

const slides = [slide1, slide2, slide3, slide4];

const FrontPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const homePageRef = useRef(null);

  // Restore scroll position or scroll to specific product card
  useEffect(() => {
    const scrollToProductId = location.state?.scrollToProductId;
    const fallbackScrollPosition = location.state?.fallbackScrollPosition || 0;

    if (scrollToProductId) {
      const targetCard = document.querySelector(`[data-product-id="${scrollToProductId}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Fallback to scroll position if card not found (e.g., due to loading delay)
        setTimeout(() => {
          window.scrollTo({ top: fallbackScrollPosition, behavior: 'smooth' });
        }, 500); // Delay to allow content to render
      }
    } else {
      window.scrollTo({ top: fallbackScrollPosition, behavior: 'smooth' });
    }

    // Clear the state to prevent re-scrolling on subsequent renders
    if (location.state?.scrollToProductId || location.state?.fallbackScrollPosition) {
      navigate('/', { replace: true, state: {} });
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

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollPosition > windowHeight * 0) {
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
  }

  return (
    <div className='front-contain'>
      <div className="headers">
        <div className="logo" style={{ backgroundImage: `url(${exproLogo})` }}></div>

        <div className="app-info-menu">
          <span>Home</span>
        </div>

        <div className="header-btn">
          {token ? (
            <span style={{ display: 'block' }} className='user-icon' onClick={() => navigate('/account')}>
              <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#fff">
                <path d="M240.92-268.31q51-37.84 111.12-59.77Q412.15-350 480-350t127.96 21.92q60.12 21.93 111.12 59.77 37.3-41 59.11-94.92Q800-417.15 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 62.85 21.81 116.77 21.81 53.92 59.11 94.92ZM480.01-450q-54.78 0-92.39-37.6Q350-525.21 350-579.99t37.6-92.39Q425.21-710 479.99-710t92.39 37.6Q610-634.79 610-580.01t-37.6 92.39Q534.79-450 480.01-450ZM480-100q-79.15 0-148.5-29.77t-120.65-81.08q-51.31-51.3-81.08-120.65Q100-400.85 100-480t29.77-148.5q29.77-69.35 81.08-120.65 51.3-51.31 120.65-81.08Q400.85-860 480-860t148.5 29.77q69.35 29.77 120.65 81.08 51.31 51.3 81.08 120.65Q860-559.15 860-480t-29.77 148.5q-29.77 69.35-81.08 120.65-51.3 51.31-120.65 81.08Q559.15-100 480-100Zm0-60q54.15 0 104.42-17.42 50.27-17.43 89.27-48.73-39-30.16-88.11-47Q536.46-290 480-290t-105.77 16.65q-49.31 16.66-87.92 47.2 39 31.3 89.27 48.73Q425.85-160 480-160Zm0-350q29.85 0 49.92-20.08Q550-550.15 550-580t-20.08-49.92Q509.85-650 480-650t-49.92 20.08Q410-609.85 410-580t20.08 49.92Q450.15-510 480-510Zm0-70Zm0 355Z" />
              </svg>
            </span>
          ) : (
            <>
              <button className="sign-btn signin" onClick={() => navigate('/signin')}>sign in</button>
              <button className="sign-btn signup" onClick={() => navigate('/signup')}>sign up</button>
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
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
              <path d="M80-240v-480h80v480H80Zm560 0-57-56 144-144H240v-80h487L584-664l56-56 240 240-240 240Z" />
            </svg>
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
      <div className='homepage' ref={homePageRef}>
        <HomePage />
      </div>
      <div className={`menu-div ${showMenu ? "show" : "hide"}`}>
        <MenuBar />
      </div>
    </div>
  );
};

export default FrontPage;