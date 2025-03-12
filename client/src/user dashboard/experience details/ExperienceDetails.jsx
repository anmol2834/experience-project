import React, { useState, useEffect } from 'react';
import './ExperienceDetails.css';
import { useNavigate } from 'react-router-dom';

function ExperienceDetails() {
  const [like, setLike] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [imageLoading, setImageLoading] = useState(true); // New state for image loading
  const navigate = useNavigate();

  const slide_img = {
    img1: "https://www.enepaltreks.com/wp-content/uploads/2018/05/chitwan.jpg",
    img2: "https://virtualnewsnation.com/wp-content/uploads/2023/05/cheetah-on-car-safari-scaled.jpg",
    img3: "https://i.pinimg.com/originals/02/7c/69/027c69839f6f4cec1240e10ccf62fa1b.jpg",
    img4: "https://www.travelbays.com/uploads/package_tours/tour_trip/tourtrip_15730198191905772652.jpg",
    img5: "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/df/c0/ed.jpg",
    img6: "https://www.tourism-of-india.com/blog/wp-content/uploads/2017/09/ranthambore-tiger-reserve.jpg",
    img7: "https://media.aspirationadventure.com/uploads/fullbanner/chitwan-jungle-safari-tour.webp",
    img8: "https://ugandarwandagorillatours.com/wp-content/uploads/2021/12/lion_sighting_morukuru_madikwe.jpg"
  };

  const images = Object.values(slide_img);
  const showMoreThumb = images.length > 3;

  const handleSlideChange = (index) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setCurrentSlide(index);
    setImageLoading(true); // Reset loading state when slide changes
  };

  const handleThumbClick = (index) => {
    setCurrentSlide(index);
    setImageLoading(true); // Reset loading state when thumb is clicked
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

  const handleLike = () => setLike(!like);

  const handleImageLoad = () => {
    setImageLoading(false); // Set loading to false when image is loaded
  };

  return (
    <div className='experience-details-container'>
      <div className="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#000000">
          <path d="M366.15-253.85 140-480l226.15-226.15L408.31-664l-154 154H820v60H254.31l154 154-42.16 42.15Z"/>
        </svg>
      </div>

      <div className="cart-icon" data-content={0}>
        <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#000000">
          <path d="M252.31-100Q222-100 201-121q-21-21-21-51.31v-455.38Q180-658 201-679q21-21 51.31-21H330v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h77.69Q738-700 759-679q21 21 21 51.31v455.38Q780-142 759-121q-21 21-51.31 21H252.31Zm0-60h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H630v90q0 12.77-8.62 21.38Q612.77-520 600-520t-21.38-8.62Q570-537.23 570-550v-90H390v90q0 12.77-8.62 21.38Q372.77-520 360-520t-21.38-8.62Q330-537.23 330-550v-90h-77.69q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM390-700h180v-10q0-37.61-26.19-63.81Q517.62-800 480-800q-37.62 0-63.81 26.19Q390-747.61 390-710v10ZM240-160v-480 480Z"/>
        </svg>
      </div>

      <div className="experience-card">
        <div className="image-gallery">
          <div 
            className="main-image"
            style={{ backgroundImage: `url(${images[currentSlide]})` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => { if(e.target.closest('.wishlist-icon')){return;} navigate('/product-slideshow', { state: { initialSlide: currentSlide } })}}
          >
            {imageLoading && (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            )}
            <img
              src={images[currentSlide]}
              alt="Main"
              style={{ display: 'none' }} // Hide the img element
              onLoad={handleImageLoad}
            />
            <span className='wishlist-icon' onClick={handleLike}>
              {like ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                </svg>
              )}
            </span>
          </div>

          <div className="thumbnail-grid">
            {images.slice(0, showMoreThumb ? 3 : 4).map((img, index) => (
              <div 
                key={index}
                className={`thumb ${index === currentSlide ? 'active-thumb' : ''}`}
                style={{ backgroundImage: `url(${img})` }}
                onClick={() => handleThumbClick(index)}
              />
            ))}
            {showMoreThumb && (
              <div 
                className="thumb more-images" 
                onClick={() => navigate('/product-slideshow', { state: { initialSlide: currentSlide } })}
              >
                +{images.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="details-section">
          <div className="header">
            <div className="title-and-map">
              <h1 className="title">St. Regis Bora Bora</h1>
              <span className='locate-icon'>
                <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#000000">
                  <path d="m600-141.54-240-84-172.15 66.61q-17.69 6.85-32.77-3.92Q140-173.62 140-192.31v-524.61q0-11.85 6.35-21.27 6.34-9.42 17.81-13.65L360-818.46l240 84 172.15-66.61q17.69-6.85 32.77 3.34Q820-787.54 820-769.23v527.69q0 12.23-6.92 21.46-6.93 9.23-18.77 13.46L600-141.54Zm-30-73.38v-468l-180-62.93v468l180 62.93Zm60 0L760-258v-474l-130 49.08v468ZM200-228l130-49.85v-468L200-702v474Zm430-454.92v468-468Zm-300-62.93v468-468Z"/>
                </svg>
                map
              </span>
            </div>
            <div className="location">
              <p>state ,</p>
              <p>city</p>
            </div>
          </div>

          <p className="description">
            Bora Bora is an island in the Leeward group of the Community Islands,
          </p>

          <div className="price-rating">
            <div className="rating">
              <span className="material-icons">star</span>
              <span>4.8</span>
              <span className="reviews">(128 reviews)</span>
            </div>
            <div className="price">
              <span className="amount">$25</span>
              <span className="per-person">/person</span>
            </div>
          </div>

          <div className="book-and-cart">
            <button className="book-now">Book Now</button>
            <button className="addCart">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                <path d="M252.31-100Q222-100 201-121q-21-21-21-51.31v-455.38Q180-658 201-679q21-21 51.31-21H330v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h77.69Q738-700 759-679q21 21 21 51.31v455.38Q780-142 759-121q-21 21-51.31 21H252.31Zm0-60h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H630v90q0 12.77-8.62 21.38Q612.77-520 600-520t-21.38-8.62Q570-537.23 570-550v-90H390v90q0 12.77-8.62 21.38Q372.77-520 360-520t-21.38-8.62Q330-537.23 330-550v-90h-77.69q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM390-700h180v-10q0-37.61-26.19-63.81Q517.62-800 480-800q-37.62 0-63.81 26.19Q390-747.61 390-710v10ZM240-160v-480 480Z"/>
              </svg>
              <span>add to cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceDetails;