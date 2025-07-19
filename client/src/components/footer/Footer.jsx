import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebook, faYoutube, faLinkedin, faReddit } from '@fortawesome/free-brands-svg-icons';
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
            We provide unique experiences like skydiving, bungee jumping, crafting, survival experiences, and more. Join us for unforgettable memories!
          </p>
          <div className='contact'>
            <span>
              {/* <FontAwesomeIcon icon={faPhone} /> +91 8733942557 */}
            </span>
            <span>
              <FontAwesomeIcon icon={faEnvelope} /> teamwandercall@gmail.com
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
            <a onClick={() => handleLinkClick('/aboutus')}>About Us</a>
            <a onClick={() => handleLinkClick('/termsAndConditions')}>Terms and Conditions</a>
          </div>
        </div>
        <div className='footer-section newsletter'>
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with our latest experiences and offers.</p>
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
            <a href='https://www.instagram.com/wandercallofficial/' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faInstagram} />  
            </a>
            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href='https://www.reddit.com/r/SuratNightoutMeetups/' target='_blank' rel='noopener noreferrer'>
              <FontAwesomeIcon icon={faReddit} />
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
        © {new Date().getFullYear()} wandercall.com Experiences. All rights reserved.
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