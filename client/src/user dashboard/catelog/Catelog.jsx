import { useContext } from 'react';
import './catelog.css';
import Catelogcard from './catelog card/Catelogcard';
import { context_of_product } from '../../context/ProductProvider';

function Catelog() {
  const { productInfo, productLoading, wishlistItems } = useContext(context_of_product);

  if (productLoading) {
    return (
      <div className="catelog-loading">
        <div className="wireframe-container">
          <div className="wireframe-header"></div>
          <div className="wireframe-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="wireframe-card">
                <div className="wireframe-image"></div>
                <div className="wireframe-details">
                  <div className="wireframe-title"></div>
                  <div className="wireframe-location"></div>
                  <div className="wireframe-price"></div>
                  <div className="wireframe-button"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catelogs">
      <h1>Explore Experiences</h1>
      <div className="catelog-aligner">
        {productInfo.length > 0 ? (
          productInfo.map((value) => {
            const isLiked = wishlistItems.some((item) => item.productId && item.productId._id === value._id);
            return (
              <Catelogcard
                key={value._id}
                state={value.location.state}
                city={value.location.city}
                title={value.title}
                desc={value.description}
                price={value.price !== undefined ? value.price : 0} // Fallback to 0 if price is undefined
                img={value.img1}
                stock={value.stock}
                mrp={value.mrp}
                ratings={value.rating}
                productId={value._id}
                isLiked={isLiked}
              />
            );
          })
        ) : (
          <div className='no-search-result-container'>No matching experiences found!</div>
        )}
      </div>
    </div>
  );
}

export default Catelog;