import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import './catelogcard.css';
import { useAuth } from '../../../context/AuthContext';
import { context_of_product } from '../../../context/ProductProvider';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faShare, faShareAlt, faShareNodes, faStar } from '@fortawesome/free-solid-svg-icons';

function Catelogcard({ title, desc, state, city, price, img, ratings, productId, isLiked }) {
  const { token } = useAuth();
  const { addToWishlist, removeFromWishlist } = useContext(context_of_product);
  const [like, setLike] = useState(isLiked);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();

  let newDesc = desc.length > 60 ? desc.slice(0, 70) + '...' : desc;

  useEffect(() => {
    setLike(isLiked);
  }, [isLiked]);

  const handleLike = async () => {
    if (!token) {
      navigate('/signin');
      return;
    }
    setWishlistLoading(true);
    try {
      if (like) {
        await removeFromWishlist(productId);
        setLike(false);
      } else {
        await addToWishlist(productId);
        setLike(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      setLike(isLiked);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleViewDetails = () => {
    const scrollPosition = window.scrollY;
    navigate(`/experience-details/${productId}`, {
      state: {
        from: '/',
        scrollPosition,
      },
    });
  };

  const rating = ratings;

  const handleStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - rating < 1) {
        stars.push(<span key={i} className="star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="catelog-card" data-product-id={productId}>
      <div className="catelog-img" style={{ backgroundImage: `url(${img || ''})` }}>

        <div className="catelog-tag">Coming Soon</div>

        <div className="heart-contain" onClick={handleLike}>
          {wishlistLoading ? (
            <div className="spinner"></div>
          ) : !like ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
            </svg>
          )}
        </div>

      </div>
      <div className="catelog-details">
        <div className="heading">
          <div>
            <h3>{title}</h3>
            {/* <div className="star-ratings">
              <span>{rating}</span>
              <FontAwesomeIcon icon={faStar} className="star-icon" />
            </div> */}
          </div>
          <div className="place_title">
            <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
            <p>{city}, {state}</p>
          </div>
        </div>
        <div className="description">
          <p>{newDesc}</p>
        </div>
        <div className="bottom-section">
          <section>
            <p className="selling-price">₹{price !== undefined ? price : 'N/A'}/Person</p>
            {/* <p className="selling-price">₹ To be Announced</p> */}
          </section>
          <section>
            <button onClick={handleViewDetails}>View Details</button>
          </section>
        </div>
      </div>
    </div>
  );
}

Catelogcard.propTypes = {
  title: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.string,
  ratings: PropTypes.number.isRequired,
  productId: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
};

export default Catelogcard;