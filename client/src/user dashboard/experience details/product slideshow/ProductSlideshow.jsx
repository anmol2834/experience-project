import { useState, useEffect } from 'react';
import './ProductSlideshow.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { context_of_product } from '../../../context/ProductContext';

function ProductSlideshow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productInfo } = useContext(context_of_product);
  const [currentSlide, setCurrentSlide] = useState(location.state?.initialSlide || 0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [animate, setAnimate] = useState(false);

  const productFromState = location.state?.product;
  const product = productFromState
    ? { ...productFromState, ...productInfo.find((p) => p._id === productFromState.productId) }
    : null;

  const images = product
    ? [
        product.img1,
        product.img2,
        product.img3,
        product.img4,
        product.img5,
        product.img6,
        product.img7,
        product.img8,
      ].filter(Boolean)
    : [];

  const handleSlideChange = (index) => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);

    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setCurrentSlide(index);
  };

  const handleThumbClick = (index) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const diff = touchStart - touchEnd;
    if (diff > 5) handleSlideChange(currentSlide + 1);
    if (diff < -5) handleSlideChange(currentSlide - 1);

    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    const activeThumb = document.querySelector(`.thumb:nth-child(${currentSlide + 1})`);
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentSlide]);

  const handleContainerBack = (e) => {
    if (e.target.closest('.product-slideshow-box') || e.target.closest('.thumbnail-slides')) {
      return;
    }
    navigate('/experience-details', { state: location.state });
  };

  useEffect(() => {
    if (!product) {
      navigate('/experience-details');
    }
  }, [product, navigate]);

  if (!product || images.length === 0) return null;

  return (
    <div className="product-slideshow-container" onClick={handleContainerBack}>
      <div className="back-to-experience-details" onClick={() => navigate('/experience-details', { state: location.state })}>
        <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#000000">
          <path d="M366.15-253.85 140-480l226.15-226.15L408.31-664l-154 154H820v60H254.31l154 154-42.16 42.15Z" />
        </svg>
      </div>

      <div
        className={`product-slideshow-box ${animate ? 'slide-in' : ''}`}
        style={{ backgroundImage: `url(${images[currentSlide]})` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <span className="left-slide" onClick={() => handleSlideChange(currentSlide - 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
            <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
          </svg>
        </span>

        <span className="right-slide" onClick={() => handleSlideChange(currentSlide + 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
            <path d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z" />
          </svg>
        </span>
      </div>

      <div className="thumbnail-slides">
        {images.map((img, index) => (
          <div
            key={index}
            className={`thumb ${index === currentSlide ? 'active-thumb' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
            onClick={() => {
              handleThumbClick(index);
              setAnimate(true);
              setTimeout(() => setAnimate(false), 500);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductSlideshow;