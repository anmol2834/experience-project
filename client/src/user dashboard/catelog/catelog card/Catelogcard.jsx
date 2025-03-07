import React, { useEffect, useState } from 'react';
import './catelogcard.css';

function Catelogcard({ title, state, city, price, img, stock, mrp, ratings }) {
  const [like, setLike] = useState(false);

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
  }

  return (
    <div className="catelog-card">
      <div
        className="catelog-img"
        style={{ backgroundImage: `url(${img || ''})` }} // Use img prop dynamically
      >
        <div className="heart-contain" onClick={() => setLike(!like)}>
          {!like ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
            </svg>
          )}
        </div>

        <div className="star-ratings">
          <span>{rating}</span>
          <div>{handleStars(rating)}</div>
        </div>
      </div>

      <div className="catelog-details">

        <div className="heading">
          <h2>{title}</h2>
          <section>
            <p>{state},</p>
            <p>{city}</p>
          </section>
        </div>

          <div className="price">
            <section>
              <p className="mrp">${mrp}</p>
              <p className="selling-price">${price}</p>
            </section>
          </div>

          <div className="add-to-cart">
            <button>Add To Cart</button>
            <span className="left">{stock} Left</span>
          </div>

      </div>
    </div>
  );
}

export default Catelogcard;
