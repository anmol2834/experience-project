import { useState, useEffect, useContext } from "react";
import {
  faCommentAlt,
  faGift,
  faHeart,
  faList,
  faTicket,
  faUser,
  faCrown,
  faStore,
  faRocket,
  faTimes,
  faSearch,
  faPhone,
  faEnvelope,
  faLocationDot,
  faGlobe
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { context_of_product } from '../../context/ProductProvider';

const Menubar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 992px)").matches);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(false);
  const { setSearchQuery } = useContext(context_of_product);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.matchMedia("(max-width: 992px)").matches;
      setIsMobile(mobileView);
      if (!mobileView) {
        setMenuOpen(false);
        setSearchExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > 100 && window.scrollY > lastScrollY) {
        setShowMenuBar(true);
      } else if (window.scrollY <= 10) {
        setShowMenuBar(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => isMobile && setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchExpanded(!searchExpanded);

  useEffect(() => {
    document.body.style.overflow = (menuOpen && isMobile) ? "hidden" : "auto";
    return () => document.body.style.overflow = "auto";
  }, [menuOpen, isMobile]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle email submission logic here
    setEmail("");
  };

  // New animated buttons
  const SpecialButton = ({ text, type, onClick }) => {
    return (
      <button 
        className={`special-button ${type}`}
        onClick={onClick}
      >
        <span>{text}</span>
      </button>
    );
  };

  return (
    <div className={`menu-bar-container ${showMenuBar ? 'show' : ''}`}>
      {/* Desktop Menu */}
      <div className="desktop-menu">
        <div className="desktop-main-menu">
          <div className="search-bar-container">
            <input
              type="search"
              placeholder="Search Your Experience"
              className="search-bar"
              onChange={handleSearch}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="search-icon"
            />
          </div>

          <div className="menu-icons">
            <div
              className="menu-icon-item"
              onClick={() => navigate('/account/wishlist')}
            >
              <FontAwesomeIcon icon={faHeart} className="icon" />
              <span className="icon-label">Wishlist</span>
            </div>
            <div
              className="menu-icon-item"
              onClick={() => navigate('/account/rewards')}
            >
              <FontAwesomeIcon icon={faGift} className="icon" />
              <span className="icon-label">Rewards</span>
            </div>
            <div
              className="menu-icon-item"
              onClick={() => navigate('/account/bookings')}
            >
              <FontAwesomeIcon icon={faTicket} className="icon" />
              <span className="icon-label">Bookings</span>
            </div>

            <div className="menu-icon-item">
              <FontAwesomeIcon icon={faGlobe} className="icon" />
              <span className="icon-label">Community</span>
            </div>
          </div>

          {/* NEW: Get In First button for desktop */}
          <div className="desktop-special-button">
            <SpecialButton 
              text="Get In First" 
              type="getInFirst" 
              onClick={() => navigate('/get-in-first')} 
            />
          </div>

          <div className="weather-info">
            <div className="temperature">27°C</div>
            <div className="weather-condition">Mostly cloudy</div>
          </div>

          <div
            className="user-icon-container"
            onClick={() => navigate("/account")}
          >
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu-bar">
        <div className="mobile-top-bar">
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faList}
            className={`hamburger-icon ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          />

          <div className={`search-bar-container ${searchExpanded ? "expanded" : ""}`}>
            {searchExpanded ? (
              <>
                <input
                  type="search"
                  placeholder="Search Your Experience"
                  className="search-bar"
                  onChange={handleSearch}
                  autoFocus
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className="search-close"
                  onClick={toggleSearch}
                />
              </>
            ) : (
              <FontAwesomeIcon
                icon={faSearch}
                className="search-icon"
                onClick={toggleSearch}
              />
            )}
          </div>

          <div
            className="user-icon-container"
            onClick={() => navigate("/account")}
          >
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
        </div>

        <div className={`mobile-menu-items ${menuOpen ? "show" : ""}`}>
          {menuOpen && (
            <div className="mobile-menu-header">
              <div className="mobile-logo" onClick={() => handleMenuItemClick('/')}>
                <span className="logo-part-1">Wandercall/</span>
                <span className="logo-part-2">Menu</span>
              </div>
            </div>
          )}

          <div className="mobile-menu-content">
            <div className="mobile-menu-grid">
              <div
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick('/account/wishlist')}
              >
                <FontAwesomeIcon icon={faHeart} className="menu-icon" />
                <p className="menu-label">Wishlist</p>
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick('/account/rewards')}
              >
                <FontAwesomeIcon icon={faGift} className="menu-icon" />
                <p className="menu-label">Rewards</p>
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick('/account/bookings')}
              >
                <FontAwesomeIcon icon={faTicket} className="menu-icon" />
                <p className="menu-label">Bookings</p>
              </div>

              <div className="mobile-menu-item">
                <FontAwesomeIcon icon={faGlobe} className="menu-icon" />
                <p className="menu-label">Community</p>
              </div>
            </div>

            {/* NEW: Special buttons for mobile */}
            <div className="mobile-special-buttons">
              <SpecialButton 
                text="Get In First" 
                type="getInFirst" 
                onClick={() => handleMenuItemClick('/get-in-first')} 
              />
              <SpecialButton 
                text="Premium Card" 
                type="premiumCard" 
                onClick={() => handleMenuItemClick('/premium-card')} 
              />
              <SpecialButton 
                text="Become Provider" 
                type="becomeProvider" 
                onClick={() => handleMenuItemClick('/become-provider')} 
              />
            </div>

            <div className="mobile-weather">
              <div className="temperature">27°C</div>
              <div className="weather-condition">Mostly cloudy</div>
            </div>

            <div className="mobile-menu-links">
              <span onClick={() => handleMenuItemClick('/aboutus')}>About Us</span>
              <span>FAQ</span>
              <span onClick={() => handleMenuItemClick('/termsAndConditions')}>Terms & Conditions</span>
              <span>Logout</span>
            </div>

            <div className="mobile-footer">
              <div className="copyright">
                © 2025 Unique Experiences. All rights reserved.
              </div>
              <div className="social-links">
                <span>Twitter</span>
                <span>Facebook</span>
              </div>
              <div className="promo-text">
                Unlock a unique world of experiences. Coming soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menubar;