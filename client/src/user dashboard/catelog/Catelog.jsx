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
            {[...Array(6)].map((_, index) => (
              <div key={index} className="wireframe-card">
                <div className="wireframe-image"></div>
                <div className="wireframe-details">
                  <div className="wireframe-title"></div>
                  <div className="wireframe-location"></div>
                  <div className="wireframe-price"></div>
                  <div className="wireframe-ratings"></div>
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
      <h1>Explore Experiences :</h1>
      <div className="catelog-aligner">
        {productInfo.length > 0 ? (
          productInfo.map((value) => {
            const isLiked = wishlistItems.some((item) => item.productId && item.productId._id === value._id);
            return (
              <Catelogcard
                key={value._id}
                state={value.state}
                city={value.city}
                title={value.title}
                desc={value.description}
                price={value.price}
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
          <p>No matching experiences found.</p>
        )}
      </div>
    </div>
  );
}

export default Catelog;