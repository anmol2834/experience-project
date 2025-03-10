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
  // Add other fields as needed to match your "products" collection
}, { strict: false }); // Optional: allows extra fields not in schema

const Product = mongoose.model('Product', productSchema); // Changed from 'products' to 'Product'

export default Product;