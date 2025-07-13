import { useState, useEffect, useRef } from 'react';
import './frontpage.css';
import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.jpg';
import slide3 from '../../assets/slide3.jpg';
import slide4 from '../../assets/slide4.jpg';
import wandercall from '../../assets/wandercall-logo1.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HomePage from '../home page/HomePage';
import MenuBar from '../menu-bar/MenuBar';
import Footer from '../../components/footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFire, faUserClock } from '@fortawesome/free-solid-svg-icons';

const slides = [slide1, slide2, slide3, slide4];

const FrontPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const homePageRef = useRef(null);

  const [stats, setStats] = useState({
    users: 0,
    waitingList: 0
  });

  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const fetchStats = () => {
      setStats({
        users: 2543,
        waitingList: 872
      });
    };

    fetchStats();
  }, []);

   useEffect(() => {
    // Text animation sequence
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinWaitingList = () => {
    navigate('/get-in-first'); 
  };


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
          <img src={wandercall} alt="wandercall logo" priority/>
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
              priority
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

        <div className="web-info-container">
        <div className="inner-web-info-container">
          <div className="engagement-stats">
            <div className="stat-item">
              <FontAwesomeIcon icon={faUser} className="stat-icon" />
              <div className="stat-value">{stats.users.toLocaleString()}+</div>
              <div className="stat-label">Adventurers</div>
            </div>
            
            <div className="stat-divider"></div>
            
            <div className="stat-item">
              <FontAwesomeIcon icon={faUserClock} className="stat-icon" />
              <div className="stat-value">{stats.waitingList.toLocaleString()}+</div>
              <div className="stat-label">Waiting</div>
            </div>
          </div>
          
          <div className="callout-text">
            {animationStep === 0 && (
              <div className="text-slide active">
                <FontAwesomeIcon icon={faFire} className="pulse" />
                <span>Be among the first to experience</span>
              </div>
            )}
            {animationStep === 1 && (
              <div className="text-slide active">
                <span>Exclusive access for early joiners</span>
              </div>
            )}
            {animationStep === 2 && (
              <div className="text-slide active">
                <span>Limited spots available</span>
              </div>
            )}
            {animationStep === 3 && (
              <div className="text-slide active">
                <span>Join the movement today</span>
              </div>
            )}
          </div>
          
          <button className="waiting-list-btn" onClick={handleJoinWaitingList}>
            Join Waiting List
            <div className="btn-arrow">→</div>
          </button>
        </div>
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