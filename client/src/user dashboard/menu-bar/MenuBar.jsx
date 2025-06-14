import { useState, useEffect, useContext } from "react";
import {
  faCommentAlt,
  faGift,
  faHeart,
  faList,
  faTicket,
  faUser,
  faCrown,
  faStore
} from "@fortawesome/free-solid-svg-icons";
import "./menubar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { context_of_product } from '../../context/ProductProvider';

const Menubar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 992px)").matches);
  const { setSearchQuery } = useContext(context_of_product); // Access setSearchQuery from context

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.matchMedia("(max-width: 992px)").matches;
      setIsMobile(mobileView);
      if (!mobileView) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => isMobile && setMenuOpen(!menuOpen);

  useEffect(() => {
    document.body.style.overflow = (menuOpen && isMobile) ? "hidden" : "auto";
    return () => document.body.style.overflow = "auto";
  }, [menuOpen, isMobile]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update searchQuery in context on input change
  };

  return (
    <div className="menu-bar-contain">
      <div className="menu-container">
        <FontAwesomeIcon
          icon={faList}
          className="hamburger-icon"
          onClick={toggleMenu}
        />
        <div className={`menu-items ${menuOpen ? "show" : ""}`}>
          <div className="menu-type1">
            <span className="mobile-menu-item">
              <FontAwesomeIcon icon={faHeart} className="menu-icon" />
              <p className="menu-label">Wishlist</p>
            </span>
            <span className="mobile-menu-item">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <p className="menu-label">Rewards</p>
            </span>
            <span className="mobile-menu-item">
              <FontAwesomeIcon icon={faTicket} className="menu-icon" />
              <p className="menu-label">Bookings</p>
            </span>
            <span className="mobile-menu-item">
              <FontAwesomeIcon icon={faCommentAlt} className="menu-icon" />
              <p className="menu-label">Community</p>
            </span>
          </div>

          <div className="menu-type2">
            <button className="premimum">
              <FontAwesomeIcon icon={faCrown} className="button-icon" />
              Premium Card
            </button>
            <button className="become-provider">
              <FontAwesomeIcon icon={faStore} className="button-icon" />
              Become Provider
            </button>
          </div>

          <div className="menu-type3">
            <span onClick={() => navigate('/aboutus')}>About Us</span>
            <span>Admin</span>
            <span>FAQ</span>
            <span onClick={() => navigate('/termsAndConditions')}>Terms and Conditions</span>
            <span className="logout-button">Logout</span>
          </div>
        </div>
      </div>
      <div className="search-bar-container">
        <input
          type="search"
          placeholder="Search Your Experience"
          className="search-bar"
          onChange={handleSearch} // Call handleSearch on input change
        />
      </div>
      <div className="user-icon-container" onClick={() => navigate("/account")}>
        <FontAwesomeIcon icon={faUser} size="2x" />
      </div>
    </div>
  );
};

export default Menubar;