import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebook, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Footer({ homeRef }) {
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    if (path === 'experiences' && homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <div className='footer-contain'>
      <div className='footer-content'>
        <div className='footer-section about'>
          <h2>About Us</h2>
          <p>
            We provide unique experiences like skydiving, bungee jumping, crafting, survival adventures, and more. Join us for unforgettable memories!
          </p>
          <div className='contact'>
            <span>
              <FontAwesomeIcon icon={faPhone} /> +91 8733942557
            </span>
            <span>
              <FontAwesomeIcon icon={faEnvelope} /> anmolsinha4321@gmail.com
            </span>
            <span>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Surat, Gujarat
            </span>
          </div>
        </div>
        <div className='footer-section links'>
          <h2>Quick Links</h2>
          <div className='footer-links'>
            <a onClick={() => handleLinkClick('/home')}>Home</a>
            <a onClick={() => handleLinkClick('experiences')}>Experiences</a>
            <a onClick={() => handleLinkClick('/contact')}>Contact</a>
            <a onClick={() => handleLinkClick('/faq')}>FAQ</a>
          </div>
        </div>
        <div className='footer-section newsletter'>
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with our latest adventures and offers.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type='email' placeholder='Enter your email' required />
            <button type='submit'>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
        <div className='footer-section social'>
          <h2>Follow Us</h2>
          <div className='social-icons'>
            <a href='https://www.instagram.com/sinha_anmol_/' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faInstagram} />  
            </a>
            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href='https://youtube.com' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        © {new Date().getFullYear()} Unique Experiences. All rights reserved.
      </div>
    </div>
  );
}

Footer.propTypes = {
  homeRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
};

export default Footer;