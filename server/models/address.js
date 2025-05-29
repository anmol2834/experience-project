
// models/address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true }, // Area / Street
  locality: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: String, required: true },
  landmark: { type: String },
  alternatePhone: { type: String },
}, { timestamps: true });

export default mongoose.model('Address', addressSchema);