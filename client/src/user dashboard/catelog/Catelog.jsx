import React, { useContext } from 'react';
import './catelog.css';
import Catelogcard from './catelog card/Catelogcard';
import { context_of_product } from '../../context/ProductContext';

function Catelog() {
  const { productInfo, productLoading, wishlistItems, wishlistLoading } = useContext(context_of_product);

  if (productLoading || wishlistLoading) {
    return <div className="catelog-loading">Loading...</div>;
  }

  return (
    <div className="catelogs">
      <h1>Explore Experiences</h1>
      <div className="catelog-aligner">
        {productInfo.map((value, index) => {
          const isLiked = wishlistItems.some((item) => item.productId._id === value._id);
          return (
            <Catelogcard
              key={index}
              state={value.state}
              city={value.city}
              title={value.title}
              price={value.price}
              img={value.experience_img}
              stock={value.stock}
              mrp={value.mrp}
              ratings={value.rating}
              productId={value._id}
              isLiked={isLiked} // Pass initial like status
            />
          );
        })}
      </div>
    </div>
  );
}

export default Catelog;