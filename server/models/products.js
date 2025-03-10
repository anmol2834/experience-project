import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  state: String,
  city: String,
  price: Number,
  experience_img: String,
  stock: Number,
  mrp: Number,
  rating: Number,
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

export default Product;