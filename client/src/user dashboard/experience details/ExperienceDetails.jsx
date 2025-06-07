import { useState, useEffect } from 'react';
import './ExperienceDetails.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { context_of_product } from '../../context/ProductProvider';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faCross, faCut, faLocationDot, faMultiply, faShareAlt, faStar, faUserCircle, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ExperienceDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const { token } = useAuth();
  const { productInfo, productLoading, wishlistItems, addToWishlist, removeFromWishlist, addToCart, cartItems } = useContext(context_of_product);

  const from = location.state?.from || '/';
  const scrollPosition = location.state?.scrollPosition || 0;

  // Define sampleReviews before using it in state
  const sampleReviews = [
    {
      name: 'Towhidur Rahman',
      avatar: 'https://via.placeholder.com/50',
      rating: 5,
      text: 'My first and only mala ordered on Etsy, and I’M beyond delighted! I requested a custom mala based on two stones I was called to invite together in this kind of creation. The fun and genuine joy I invite together in this kind of creation.',
      date: '24-10-2022',
      likes: 10,
      dislikes: 2,
    },
    {
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/50',
      rating: 4,
      text: 'Great experience overall. The service was excellent, though it felt a bit pricey for what was offered.',
      date: '15-01-2023',
      likes: 8,
      dislikes: 3,
    },
    {
      name: 'Alex Johnson',
      avatar: 'https://via.placeholder.com/50',
      rating: 5,
      text: 'Absolutely fantastic! Exceeded all my expectations, and I’ll definitely be coming back.',
      date: '10-02-2023',
      likes: 15,
      dislikes: 1,
    },
    {
      name: 'Emily Davis',
      avatar: 'https://via.placeholder.com/50',
      rating: 3,
      text: 'It was okay, but I expected more for the price.',
      date: '05-03-2023',
      likes: 5,
      dislikes: 4,
    },
  ];

  const [like, setLike] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapView, setMapView] = useState('standard');
  const [reviewPage, setReviewPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(null);

  const [reviewInteractions, setReviewInteractions] = useState(
    sampleReviews.map((review) => ({
      likes: review.likes,
      dislikes: review.dislikes,
      userLiked: false,
      userDisliked: false,
    }))
  );

  useEffect(() => {
    setLike(wishlistItems.some((item) => item.productId === productId || (item.productId && item.productId._id === productId)));
  }, [wishlistItems, productId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = productInfo.find((p) => p._id === productId);

  useEffect(() => {
    if (!productLoading && !product) {
      navigate('/home');
    }
  }, [productLoading, product, navigate]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        if (transitionDirection === 'next') {
          setReviewPage((prev) => prev + 1);
        } else if (transitionDirection === 'prev') {
          setReviewPage((prev) => prev - 1);
        }
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, transitionDirection]);

  if (productLoading) {
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

  if (!product) {
    return null;
  }

  const images = [
    product.img1,
    product.img2,
    product.img3,
    product.img4,
    product.img5,
    product.img6,
    product.img7,
    product.img8,
  ].filter(Boolean);

  const showMoreThumb = images.length > 3;

  const handleSlideChange = (index) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setCurrentSlide(index);
    setImageLoading(true);
  };

  const handleThumbClick = (index) => {
    setCurrentSlide(index);
    setImageLoading(true);
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
      setLike(wishlistItems.some((item) => item.productId === productId || (item.productId && item.productId._id === productId)));
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleBack = () => {
    navigate(from, {
      state: { scrollToProductId: productId, fallbackScrollPosition: scrollPosition },
      replace: true,
    });
  };

  const handleAddToCart = () => {
    if (!token) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }
    addToCart(product._id);
  };

  const handleBookNow = () => {
    navigate('/book_page', { state: { product } });
  };

  const handleLocationClick = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const handleLikeReview = (globalIndex) => {
    setReviewInteractions((prev) =>
      prev.map((interaction, i) => {
        if (i !== globalIndex) return interaction;
        if (interaction.userLiked) {
          return { ...interaction, likes: interaction.likes - 1, userLiked: false };
        }
        if (interaction.userDisliked) {
          return {
            ...interaction,
            likes: interaction.likes + 1,
            dislikes: interaction.dislikes - 1,
            userLiked: true,
            userDisliked: false,
          };
        }
        return { ...interaction, likes: interaction.likes + 1, userLiked: true };
      })
    );
  };

  const handleDislikeReview = (globalIndex) => {
    setReviewInteractions((prev) =>
      prev.map((interaction, i) => {
        if (i !== globalIndex) return interaction;
        if (interaction.userDisliked) {
          return { ...interaction, dislikes: interaction.dislikes - 1, userDisliked: false };
        }
        if (interaction.userLiked) {
          return {
            ...interaction,
            likes: interaction.likes - 1,
            dislikes: interaction.dislikes + 1,
            userLiked: false,
            userDisliked: true,
          };
        }
        return { ...interaction, dislikes: interaction.dislikes + 1, userDisliked: true };
      })
    );
  };

  const handleNextPage = () => {
    if ((reviewPage + 1) * 3 < sampleReviews.length) {
      setTransitionDirection('next');
      setIsTransitioning(true);
    }
  };

  const handlePrevPage = () => {
    if (reviewPage > 0) {
      setTransitionDirection('prev');
      setIsTransitioning(true);
    }
  };

  const MapViewToggle = () => {
    const map = useMap();
    useEffect(() => {
      const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© <a href="https://www.esri.com/">Esri</a>',
      });

      if (mapView === 'standard') {
        standardLayer.addTo(map);
        satelliteLayer.remove();
      } else {
        satelliteLayer.addTo(map);
        standardLayer.remove();
      }
    }, [mapView]);

    return null;
  };

  const currentReviews = sampleReviews.slice(reviewPage * 3, (reviewPage * 3) + 3);

  return (
    <div className="experience-details-container">
      <div className="headers">
        <div className="back-btn" onClick={handleBack}>
          <FontAwesomeIcon className="back-ico" icon={faArrowLeftLong} />
        </div>

        <div className="cart-icon" data-content={cartItems.length} onClick={() => navigate('/add_to_cart')}>
          <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#000000">
            <path d="M252.31-100Q222-100 201-121q-21-21-21-51.31v-455.38Q180-658 201-679q21-21 51.31-21H330v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h77.69Q738-700 759-679q21 21 21 51.31v455.38Q780-142 759-121q-21 21-51.31 21H252.31Zm0-60h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H630v90q0 12.77-8.62 21.38Q612.77-520 600-520t-21.38-8.62Q570-537.23 570-550v-90H390v90q0 12.77-8.62 21.38Q372.77-520 360-520t-21.38-8.62Q330-537.23 330-550v-90h-77.69q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM390-700h180v-10q0-37.61-26.19-63.81Q517.62-800 480-800q-37.62 0-63.81 26.19Q390-747.61 390-710v10ZM240-160v-480 480Z" />
          </svg>
        </div>
      </div>

      <div className="experience-card">
        <div className="image-gallery">
          <div
            className="main-image"
            style={{ backgroundImage: `url(${images[currentSlide]})` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => {
              if (e.target.closest('.wishlist-icon')) {
                return;
              }
              navigate(`/product-slideshow/${productId}`, {
                state: {
                  initialSlide: currentSlide,
                  from: location.pathname,
                },
              });
            }}
          >
            {imageLoading && (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            )}
            <img
              src={images[currentSlide]}
              alt="Main"
              style={{ display: 'none' }}
              onLoad={handleImageLoad}
            />
            <span className="wishlist-icon" onClick={handleLike}>
              {wishlistLoading ? (
                <div className="spinner"></div>
              ) : like ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
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
                onClick={() => navigate(`/product-slideshow/${productId}`, {
                  state: {
                    initialSlide: currentSlide,
                    from: location.pathname,
                  },
                })}
              >
                +{images.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="details-section">
          <div className="header">
            <div className="title-and-map">
              <h1 className="title">{product.title}</h1>
              <span className="locate-and-share-icon">
                <FontAwesomeIcon className="shareAlt" icon={faShareAlt} />
                <FontAwesomeIcon className="location-dot" icon={faLocationDot} onClick={handleLocationClick} />
              </span>
            </div>
            <div className="location">
              <p className="state">{product.location.city} ,</p>
              <p className="city">{product.location.state}</p>
            </div>
          </div>

          <p className="description">{product.description || 'No description available.'}</p>

          <div className="price-rating">
            <div className="rating">
              <span>
                <FontAwesomeIcon icon={faStar} color='var(--highlight-element)' />
              </span>
              <span>{product.rating || 'N/A'}</span>
              <span className="reviews">(0 reviews)</span>
            </div>
            <div className="price">
              <span className="amount">₹{product.price}</span>
              <span className="per-person">/person</span>
            </div>
          </div>

          <div className="book-and-cart">
            <button className="book-now" onClick={handleBookNow}>Book Now</button>
            <button className="addCart" onClick={handleAddToCart}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                <path d="M252.31-100Q222-100 201-121q-21-21-21-51.31v-455.38Q180-658 201-679q21-21 51.31-21H330v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h77.69Q738-700 759-679q21 21 21 51.31v455.38Q780-142 759-121q-21 21-51.31 21H252.31Zm0-60h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H630v90q0 12.77-8.62 21.38Q612.77-520 600-520t-21.38-8.62Q570-537.23 570-550v-90H390v90q0 12.77-8.62 21.38Q372.77-520 360-520t-21.38-8.62Q330-537.23 330-550v-90h-77.69q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM390-700h180v-10q0-37.61-26.19-63.81Q517.62-800 480-800q-37.62 0-63.81 26.19Q390-747.61 390-710v10ZM240-160v-480 480Z" />
              </svg>
              <span>add to cart</span>
            </button>
          </div>
        </div>
      </div>

      {showMap && (
        <div className="map-overlay">
          <MapContainer
            center={[product.location.latitude || 21.176901, product.location.longitude || 72.661396]}
            zoom={13}
            className="map-container"
          >
            <MapViewToggle />
            <Marker position={[product.location.latitude || 21.176901, product.location.longitude || 72.661396]}>
              <Popup>{product.title}</Popup>
            </Marker>
          </MapContainer>
          <button
            onClick={handleCloseMap}
            className="map-close-btn"
          >
            <FontAwesomeIcon icon={faMultiply}/>
          </button>
          <button
            onClick={() => setMapView(mapView === 'standard' ? 'satellite' : 'standard')}
            className="map-toggle-btn"
          >
            {mapView === 'standard' ? 'Satellite View' : 'Standard View'}
          </button>
        </div>
      )}

      <div className="reviews-container">
        <div className="reviews-header">
          <h2>Reviews</h2>
          <span className="review-period">March 2021 - February 2022</span>
        </div>
        <div className="reviews-summary">
          <div className="total-reviews">
            <h3>10.0K</h3>
            <p>
              Total Reviews <span className="growth">21% <span className="growth-icon">↗</span></span>
            </p>
          </div>
          <div className="average-rating">
            <h3>4.0 <span className="stars"><FontAwesomeIcon icon={faStar} /></span></h3>
            <p>Average rating on this year</p>
          </div>
          <div className="rating-distribution">
            <div className="rating-bar">
              <span>5</span>
              <div className="bar"><div className="fill" style={{ width: '80%' }}></div></div>
              <span>2.0K</span>
            </div>
            <div className="rating-bar">
              <span>4</span>
              <div className="bar"><div className="fill" style={{ width: '40%' }}></div></div>
              <span>1.0K</span>
            </div>
            <div className="rating-bar">
              <span>3</span>
              <div className="bar"><div className="fill" style={{ width: '20%' }}></div></div>
              <span>500</span>
            </div>
            <div className="rating-bar">
              <span>2</span>
              <div className="bar"><div className="fill" style={{ width: '10%' }}></div></div>
              <span>200</span>
            </div>
            <div className="rating-bar">
              <span>1</span>
              <div className="bar"><div className="fill" style={{ width: '5%' }}></div></div>
              <span>0K</span>
            </div>
          </div>
        </div>
        <div className={`reviews-list ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          {currentReviews.map((review, localIndex) => {
            const globalIndex = reviewPage * 3 + localIndex;
            return (
              <div key={globalIndex} className="review-item">
                <div className="reviewer-info">
                  <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '50px', width: '50px', height: '50px' }} />
                  <div className="reviewer-details">
                    <h4>{review.name}</h4>
                  </div>
                  <div className="review-meta">
                    <span className="review-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                      ))}
                    </span>
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
                <div className="review-actions">
                  <button className="action-btn like-btn" onClick={() => handleLikeReview(globalIndex)}>
                    <FontAwesomeIcon icon={faThumbsUp} className={`like-icon ${reviewInteractions[globalIndex].userLiked ? 'active' : ''}`} />
                    <span className="like-count">{reviewInteractions[globalIndex].likes}</span>
                  </button>
                  <button className="action-btn dislike-btn" onClick={() => handleDislikeReview(globalIndex)}>
                    <FontAwesomeIcon icon={faThumbsDown} className={`dislike-icon ${reviewInteractions[globalIndex].userDisliked ? 'active' : ''}`} />
                    <span className="dislike-count">{reviewInteractions[globalIndex].dislikes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="reviews-navigation">
          {reviewPage > 0 && (
            <button className="see-more-reviews" onClick={handlePrevPage}>Previous Reviews</button>
          )}
          {sampleReviews.length > 3 && (reviewPage + 1) * 3 < sampleReviews.length && (
            <button className="see-more-reviews" onClick={handleNextPage}>See More Reviews</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExperienceDetails;