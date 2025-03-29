import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import './catelogcard.css';
import { useAuth } from '../../../context/AuthContext';
import { context_of_product } from '../../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faShare, faShareAlt, faShareNodes } from '@fortawesome/free-solid-svg-icons';

function Catelogcard({ title, desc, state, city, price, img, ratings, productId, isLiked }) {
  const { token } = useAuth();
  const { addToWishlist, removeFromWishlist } = useContext(context_of_product);
  const [like, setLike] = useState(isLiked);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();

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

    navigate('/experience-details', {
      state: {
        product: {
          title,
          state,
          city,
          price,
          rating: ratings,
          productId,
          img1: img,
        },
        from: '/',
        scrollPosition,
        productId,
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
      <div className="catelog-img" style={{ backgroundImage: `url(${img || ''})` }}></div>
      <div className="catelog-details">

        <div className="share-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e3e3e3"><path d="M672.22-100q-44.91 0-76.26-31.41-31.34-31.41-31.34-76.28 0-6 4.15-29.16L284.31-404.31q-14.46 15-34.36 23.5t-42.64 8.5q-44.71 0-76.01-31.54Q100-435.39 100-480q0-44.61 31.3-76.15 31.3-31.54 76.01-31.54 22.74 0 42.64 8.5 19.9 8.5 34.36 23.5l284.46-167.08q-2.38-7.38-3.27-14.46-.88-7.08-.88-15.08 0-44.87 31.43-76.28Q627.49-860 672.4-860t76.25 31.44Q780-797.13 780-752.22q0 44.91-31.41 76.26-31.41 31.34-76.28 31.34-22.85 0-42.5-8.69Q610.15-662 595.69-677L311.23-509.54q2.38 7.39 3.27 14.46.88 7.08.88 15.08t-.88 15.08q-.89 7.07-3.27 14.46L595.69-283q14.46-15 34.12-23.69 19.65-8.69 42.5-8.69 44.87 0 76.28 31.43Q780-252.51 780-207.6t-31.44 76.25Q717.13-100 672.22-100Zm.09-60q20.27 0 33.98-13.71Q720-187.42 720-207.69q0-20.27-13.71-33.98-13.71-13.72-33.98-13.72-20.27 0-33.98 13.72-13.72 13.71-13.72 33.98 0 20.27 13.72 33.98Q652.04-160 672.31-160Zm-465-272.31q20.43 0 34.25-13.71 13.83-13.71 13.83-33.98 0-20.27-13.83-33.98-13.82-13.71-34.25-13.71-20.11 0-33.71 13.71Q160-500.27 160-480q0 20.27 13.6 33.98 13.6 13.71 33.71 13.71Zm465-272.3q20.27 0 33.98-13.72Q720-732.04 720-752.31q0-20.27-13.71-33.98Q692.58-800 672.31-800q-20.27 0-33.98 13.71-13.72 13.71-13.72 33.98 0 20.27 13.72 33.98 13.71 13.72 33.98 13.72Zm0 496.92ZM207.69-480Zm464.62-272.31Z" /></svg>
        </div>

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

        <div className="heading">
          <h2>{title}</h2>
          <div className='place_title'>
            <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
            <p>{state},{city}</p>
          </div>
        </div>

        <div className="bottom-section">
          <section>
            <p className="selling-price">${price}/Person</p>
            <div className="star-ratings">
              <span>{rating}</span>
              <div>{handleStars(rating)}</div>
            </div>
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