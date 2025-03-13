import React, { useContext } from 'react';
import './catelog.css';
import Catelogcard from './catelog card/Catelogcard';
import { context_of_product } from '../../context/ProductContext';

function Catelog() {
  const { productInfo, productLoading, wishlistItems } = useContext(context_of_product);

  if (productLoading) {
    return <div className="catelog-loading">Loading...</div>;
  }

  return (
    <div className="catelogs">
      <h1>Explore Experiences :</h1>
      <div className="catelog-aligner">
        {productInfo.map((value) => {
          const isLiked = wishlistItems.some((item) => item.productId && item.productId._id === value._id);
          return (
            <Catelogcard
              key={value._id}
              state={value.state}
              city={value.city}
              title={value.title}
              price={value.price}
              img={value.img1}
              stock={value.stock}
              mrp={value.mrp}
              ratings={value.rating}
              productId={value._id}
              isLiked={isLiked}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Catelog;