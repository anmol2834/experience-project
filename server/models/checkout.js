
import mongoose from 'mongoose';

const checkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  companyName: { type: String, required: true },
  providerName: { type: String, required: true },
  selectedDate: { type: Date, required: true },
  participants: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  gst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  coupon: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Checkout', checkoutSchema);