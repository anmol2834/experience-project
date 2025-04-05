import { useEffect, useRef } from 'react';
import './homepage.css';
// import Category from '../categories/Category'; 
import Catelog from '../catelog/Catelog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
  const catelogRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          catelogRef.current.classList.add('animate');
        } else {
          catelogRef.current.classList.remove('animate');
        }
      },
      {
        threshold: 0.1,
      }
    )

    if (catelogRef.current) {
      observer.observe(catelogRef.current);
    }

    return () => {
      if (catelogRef.current) {
        observer.unobserve(catelogRef.current);
      }
    };
  }, []);

  return (
    <div className='home-contain'>
      {/* <Category /> */}
      <div className='catelog-contain' ref={catelogRef}>
        <Catelog />

        <section class="how-it-works">
          <div class="work-container">
            <h2 class="section-title">How It Works</h2>

            <div class="steps-grid">

              <div class="step-card">
                <div class="step-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="white"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q146 0 255.5 91.5T872-559h-82q-19-73-68.5-130.5T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h80v120h-40L168-552q-3 18-5.5 36t-2.5 36q0 131 92 225t228 95v80Zm364-20L716-228q-21 12-45 20t-51 8q-75 0-127.5-52.5T440-380q0-75 52.5-127.5T620-560q75 0 127.5 52.5T800-380q0 27-8 51t-20 45l128 128-56 56ZM620-280q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z" /></svg>
                </div>
                <h3 class="step-title">Discover</h3>
                <p class="step-description">
                  Explore our curated collection of one-of-a-kind experiences across various categories and locations.
                </p>
              </div>

              <div class="step-card highlighted">
                <div class="step-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="black"><path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" /></svg>
                </div>
                <h3 class="step-title">Book</h3>
                <p class="step-description">
                  Secure your spot with our simple booking process, instant confirmation, and flexible payment options.
                </p>
              </div>

              <div class="step-card">
                <div class="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="white"><path d="M660-570q-25 0-42.5-17.5T600-630q0-25 17.5-42.5T660-690q25 0 42.5 17.5T720-630q0 25-17.5 42.5T660-570Zm-360 0q-25 0-42.5-17.5T240-630q0-25 17.5-42.5T300-690q25 0 42.5 17.5T360-630q0 25-17.5 42.5T300-570Zm180 110q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460Zm0-220q-25 0-42.5-17.5T420-740q0-25 17.5-42.5T480-800q25 0 42.5 17.5T540-740q0 25-17.5 42.5T480-680Zm0 520q-20 0-40.5-3t-39.5-8v-143q0-35 23.5-60.5T480-400q33 0 56.5 25.5T560-314v143q-19 5-39.5 8t-40.5 3Zm-140-32q-20-8-38.5-18T266-232q-28-20-44.5-52T205-352q0-26-5.5-48.5T180-443q-10-13-37.5-39.5T92-532q-11-11-11-28t11-28q11-11 28-11t28 11l153 145q20 18 29.5 42.5T340-350v158Zm280 0v-158q0-26 10-51t29-42l153-145q12-11 28.5-11t27.5 11q11 11 11 28t-11 28q-23 23-50.5 49T780-443q-14 20-19.5 42.5T755-352q0 36-16.5 68.5T693-231q-16 11-34.5 21T620-192Z"/></svg>
                </div>
                <h3 class="step-title">Enjoy</h3>
                <p class="step-description">
                  Create lasting memories with expertly designed and professionally hosted experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default HomePage;