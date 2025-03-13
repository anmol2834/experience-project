import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Define _id as String explicitly
  provider_Name: String,
  company_Name: String,
  title: String,
  state: String,
  city: String,
  mrp: Number,
  price: Number,
  rating: Number,
  description: String,
  img1: String,
  img2: String,
  img3: String,
  img4: String,
  img5: String,
  img6: String,
  img7: String,
  img8: String,
}, { collection: 'products' }); // Explicitly set collection name

export default mongoose.model('Product', productSchema);