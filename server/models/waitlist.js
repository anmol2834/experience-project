import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 13 },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  rewards: {
    discountVoucher: { type: Number, default: 10 }, // Changed to number for 10% off
    priorityAccess: { type: Boolean, default: true },
    welcomeXP: { type: Number, default: 5000 },
    vipEvents: { type: Boolean, default: true }
  },
  claimed: { type: Boolean, default: false },
  joinDate: { type: Date, default: Date.now }
});

export default mongoose.model('Waitlist', waitlistSchema);