import React, { useState, useEffect } from 'react'
import './ProductSlideshow.css'
import { useNavigate, useLocation } from 'react-router-dom'

function ProductSlideshow() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentSlide, setCurrentSlide] = useState(location.state?.initialSlide || 0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [animate, setAnimate] = useState(false);

    const slide_img = {
        img1: "https://www.enepaltreks.com/wp-content/uploads/2018/05/chitwan.jpg",
        img2: "https://virtualnewsnation.com/wp-content/uploads/2023/05/cheetah-on-car-safari-scaled.jpg",
        img3: "https://i.pinimg.com/originals/02/7c/69/027c69839f6f4cec1240e10ccf62fa1b.jpg",
        img4: "https://www.travelbays.com/uploads/package_tours/tour_trip/tourtrip_15730198191905772652.jpg",
        img5: "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/df/c0/ed.jpg",
        img6: "https://www.tourism-of-india.com/blog/wp-content/uploads/2017/09/ranthambore-tiger-reserve.jpg",
        img7: "https://media.aspirationadventure.com/uploads/fullbanner/chitwan-jungle-safari-tour.webp",
        img8: "https://ugandarwandagorillatours.com/wp-content/uploads/2021/12/lion_sighting_morukuru_madikwe.jpg"
    }

    const images = Object.values(slide_img);

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
        if (diff > 5) handleSlideChange(currentSlide + 1); // Swipe left
        if (diff < -5) handleSlideChange(currentSlide - 1); // Swipe right

        setTouchStart(0);
        setTouchEnd(0);
    };

    useEffect(() => {
        const activeThumb = document.querySelector(`.thumb:nth-child(${currentSlide + 1})`);
        if (activeThumb) {
            activeThumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [currentSlide]);

    return (
        <div className="product-slideshow-container">
            <div className="back-btn" onClick={() => navigate('/experience-details')}>
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
                <span className='left-slide' onClick={() => handleSlideChange(currentSlide - 1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000">
                        <path d="M432.31-307.31v-345L262.69-480l169.62 172.69ZM520-140h60v-680h-60v680Z" />
                    </svg>
                </span>

                <span className='right-slide' onClick={() => handleSlideChange(currentSlide + 1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000">
                        <path d="M380-140v-680h60v680h-60Zm147.69-167.31v-345L697.31-480 527.69-307.31Z" />
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
    )
}

export default ProductSlideshow