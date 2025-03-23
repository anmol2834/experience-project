import { useEffect, useRef } from 'react';
import './homepage.css';
import Category from '../categories/Category';
import Catelog from '../catelog/Catelog';

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
      <Category />
      <div className='catelog-contain' ref={catelogRef}>
        <Catelog />
      </div>
    </div>
  );
}

export default HomePage;