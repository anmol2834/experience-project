import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
  dob: { type: Date },
  gender: { type: String },
  otp: { type: String },
  otpExpiration: { type: Date },
  lastOtpSent: { type: Date },
  street: { type: String }, 
  city: { type: String },   
  state: { type: String }, 
  zip: { type: String },   
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;