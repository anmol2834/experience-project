import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import User from './models/users.js';
import Wishlist from './models/wishlist.js';
import Product from './models/products.js';
import Cart from './models/cart.js';
import Checkout from './models/checkout.js';
import Address from './models/address.js';
import Waitlist from './models/waitlist.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { generateToken, verifyToken } from './middlewares/middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://wandercall.onrender.com', 'https://wandercall.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files from React
app.use(express.static(path.join(__dirname, '../client/dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));


mongoose.connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  requireTLS: true,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper functions
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isValidOTP = (user, providedOTP) => {
  if (!user.otp || !user.otpExpiration || new Date() > user.otpExpiration) {
    return false;
  }
  return user.otp === providedOTP;
};

// Waitlist routes
app.post('/waitlist/join', async (req, res) => {
  const { name, age, email, phone } = req.body;
  try {
    const existingWaitlist = await Waitlist.findOne({ $or: [{ email }, { phone }] });
    if (existingWaitlist) {
      return res.status(400).json({ message: 'You have already joined the waitlist' });
    }

    const waitlistEntry = new Waitlist({ name, age, email, phone });
    await waitlistEntry.save();

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser && existingUser.verified) {
      existingUser.discountVouchers = 50;
      existingUser.priorityAccess = true;
      existingUser.xp += 5000;
      existingUser.vipEvents = true;
      waitlistEntry.claimed = true;
      await existingUser.save();
      await waitlistEntry.save();
    }

    res.status(201).json({ message: 'Joined waitlist successfully' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email or phone already in use' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
});

app.get('/waitlist/count', async (req, res) => {
  try {
    const count = await Waitlist.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { firstname, lastname, phone, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send('Invalid email');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({
      firstname,
      lastname,
      phone,
      email,
      password,
      verificationCode,
      remainingDiscountBookings: 0,
      priorityAccess: false,
      xp: 0,
      vipEvents: false,
    });
    await user.save();

    const mailOptions = {
      from: 'Wandercall Team',
      to: email,
      subject: 'Email Verification',
      html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #111; color: #fff; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dxkjxauun/image/upload/v1752848182/wandercall-logo2_wqetq9.png" alt="wandercall" style="height: 50px; fileter : invert(100%);">
      </div>
      <h2 style="text-align: center;">Hi ${user.firstname || ''},</h2>
      <p style="font-size: 16px; text-align: center;">Use the code below to verify your email:</p>
      <div style="font-size: 32px; font-weight: bold; text-align: center; background: #333; padding: 10px 0; border-radius: 8px; letter-spacing: 2px;">
        ${verificationCode}
      </div>
      <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #bbb;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wandercall.com" style="color: #6c63ff; text-decoration: none;">Visit wandercall</a>
      </div>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Verification code sent');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Google sign-in route
app.post('/google-signin', async (req, res) => {
  const { email, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        firstname: name,
        lastname: '',
        phone: '',
        email,
        password: '',
        verified: true,
      });
      await user.save();
    }
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Validate token route
app.get('/validate-token', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.status(200).json({ valid: true });
    } else {
      res.status(404).json({ valid: false, message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ valid: false, message: 'Server error' });
  }
});

// Get user details (requires token)
app.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'firstname lastname email phone dob gender street city state zip remainingDiscountBookings priorityAccess xp vipEvents'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (requires token)
app.put('/user', verifyToken, async (req, res) => {
  try {
    const { firstname, lastname, email, phone, dob, gender, street, city, state, zip } = req.body;

    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return res.status(400).json({ message: 'User email already exists' });
      }
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: req.user.id } });
      if (phoneExists) {
        return res.status(400).json({ message: 'User phone number already exists' });
      }
    }

    const updateData = { firstname, lastname, email, phone, dob, gender, street, city, state, zip };
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify route
app.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email, verificationCode: code });
    if (!user) {
      return res.status(400).send('Invalid verification code');
    }
    user.verified = true;
    user.verificationCode = undefined;

    const waitlistEntry = await Waitlist.findOne({ $or: [{ email: user.email }, { phone: user.phone }] });
    if (waitlistEntry && !waitlistEntry.claimed) {
      user.discountVouchers = 50;
      user.priorityAccess = true;
      user.xp += 5000;
      user.vipEvents = true;
      waitlistEntry.claimed = true;
      await waitlistEntry.save();
    }

    await user.save();
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Resend verification code
app.post('/resend', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }
    if (user.verified) {
      return res.status(400).send('User already verified');
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    await user.save();

    const mailOptions = {
      from: 'Wandercall Team',
      to: email,
      subject: 'Resend Verification Code',
      html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #111; color: #fff; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dxkjxauun/image/upload/v1752848182/wandercall-logo2_wqetq9.png" alt="wandercall" style="height: 50px; fileter : invert(100%);">
      </div>
      <h2 style="text-align: center;">Hi ${user.firstname || ''},</h2>
      <p style="font-size: 16px; text-align: center;">Use the code below to verify your email:</p>
      <div style="font-size: 32px; font-weight: bold; text-align: center; background: #333; padding: 10px 0; border-radius: 8px; letter-spacing: 2px;">
        ${verificationCode}
      </div>
      <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #bbb;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wandercall.com" style="color: #6c63ff; text-decoration: none;">Visit wandercall</a>
      </div>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Verification code resent');
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Change password using old password (requires token)
app.post('/change-password-old', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send OTP for password change (requires token)
app.post('/send-otp', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.lastOtpSent && (new Date() - user.lastOtpSent) < 1 * 60 * 1000) {
      return res.status(400).json({ message: 'Please wait 1 minutes before requesting a new OTP' });
    }

    const otp = generateOTP();
    const expiration = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes

    user.otp = otp;
    user.otpExpiration = expiration;
    user.lastOtpSent = new Date();
    await user.save();

    const mailOptions = {
      from: 'Wandercall Team',
      to: user.email,
      subject: 'Password Change OTP',
      html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #0d0d0d; color: #f2f2f2; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dxkjxauun/image/upload/v1752848182/wandercall-logo2_wqetq9.png" alt="Wandercall" style="height: 50px; fileter : invert(100%);">
      </div>
      <h2 style="text-align: center; color: #00aaff;">Password Change Request</h2>
      <p style="font-size: 16px; text-align: center;">We received a request to change your password. Use the OTP below to continue:</p>
      <div style="font-size: 32px; font-weight: bold; text-align: center; background: #1a1a1a; padding: 12px 0; border-radius: 8px; letter-spacing: 2px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="text-align: center; font-size: 14px; color: #bbbbbb;">
        This OTP is valid for the next 10 minutes. If you didn't request a password change, please ignore this email.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wandercall.com" style="color: #00aaff; text-decoration: none; font-size: 14px;">Visit Wandercall</a>
      </div>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending OTP');
      }
      res.status(200).send('OTP sent successfully');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend OTP (requires token)
app.post('/resend-otp', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.lastOtpSent) {
      return res.status(400).json({ message: 'No OTP has been sent yet' });
    }

    if ((new Date() - user.lastOtpSent) < 1 * 60 * 1000) {
      return res.status(400).json({ message: 'You can only resend OTP after 1 minutes' });
    }

    const otp = generateOTP();
    const expiration = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes

    user.otp = otp;
    user.otpExpiration = expiration;
    user.lastOtpSent = new Date();
    await user.save();

    const mailOptions = {
      from: 'Wandercall Team',
      to: user.email,
      subject: 'Password Change OTP',
      html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background: #0d0d0d; color: #f2f2f2; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dxkjxauun/image/upload/v1752848182/wandercall-logo2_wqetq9.png" alt="Wandercall" style="height: 50px; fileter : invert(100%);">
      </div>
      <h2 style="text-align: center; color: #00aaff;">New OTP Generated</h2>
      <p style="font-size: 16px; text-align: center;">As requested, here’s your new OTP to complete your password change:</p>
      <div style="font-size: 32px; font-weight: bold; text-align: center; background: #1a1a1a; padding: 12px 0; border-radius: 8px; letter-spacing: 2px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="text-align: center; font-size: 14px; color: #bbbbbb;">
        This OTP is valid for the next 10 minutes. If you didn't request a new OTP, you can safely ignore this email.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wandercall.com" style="color: #00aaff; text-decoration: none; font-size: 14px;">Visit Wandercall</a>
      </div>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending OTP');
      }
      res.status(200).send('OTP resent successfully');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP (requires token)
app.post('/verify-otp', verifyToken, async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (isValidOTP(user, otp)) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// New endpoint: Verify OTP for email verification (no token required)
app.post('/verify-otp-no-token', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (!isValidOTP(user, otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
    const token = generateToken(user);
    res.status(200).json({ message: 'Email verified successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password using OTP (requires token)
app.post('/change-password-otp', verifyToken, async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // Pre-save hook will hash it
    user.otp = undefined;
    user.otpExpiration = undefined;
    user.lastOtpSent = undefined;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check email existence (no token required)
app.post('/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User email does not exist' });
    }
    res.status(200).json({ message: 'Email exists' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send OTP for password reset (no token required)
app.post('/send-reset-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const expiration = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes

    user.otp = otp;
    user.otpExpiration = expiration;
    await user.save();

     const mailOptions = {
      from: 'Wandercall Team',
      to: user.email,
      subject: 'Password Reset OTP',
      html: `
    <div style="max-width:600px; margin:auto; padding:20px; font-family:Arial,sans-serif; background:#0d0d0d; color:#f2f2f2; border-radius:10px;">
      <div style="text-align:center; margin-bottom:20px;">
        <img src="https://res.cloudinary.com/dxkjxauun/image/upload/v1752848182/wandercall-logo2_wqetq9.png" alt="Wandercall" style="height:50px; fileter : invert(100%);">
      </div>
      <h2 style="text-align:center; color:#00aaff;">Password Reset OTP</h2>
      <p style="font-size:16px; text-align:center;">You requested to reset your password — here’s your OTP:</p>
      <div style="font-size:32px; font-weight:bold; text-align:center; background:#1a1a1a; padding:12px 0; border-radius:8px; letter-spacing:2px; margin:20px 0;">
        ${otp}
      </div>
      <p style="text-align:center; font-size:14px; color:#bbbbbb;">
        This OTP is valid for 10 minutes. If you didn’t request a password reset, please ignore this email.
      </p>
      <div style="text-align:center; margin-top:30px;">
        <a href="https://wandercall.com" style="color:#00aaff; text-decoration:none; font-size:14px;">Visit Wandercall</a>
      </div>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending OTP');
      }
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password with OTP (no token required)
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!isValidOTP(user, otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword; // Pre-save hook will hash it
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send OTP for email verification (no token required)
app.post('/send-verification-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const otp = generateOTP();
    const expiration = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes

    user.otp = otp;
    user.otpExpiration = expiration;
    await user.save();

    const mailOptions = {
      from: 'Wandercall Team',
      to: user.email,
      subject: 'Email Verification OTP',
      html: `
    <div style="max-width:600px; margin:auto; padding:20px; font-family:Arial,sans-serif; background:#0d0d0d; color:#f2f2f2; border-radius:10px; fileter : invert(100%);">
      <div style="text-align:center; margin-bottom:20px;">
        <img src="https://res.cloudinary.com/dxkjxauun/image/upload/v1752848182/wandercall-logo2_wqetq9.png" alt="Wandercall" style="height:50px;">
      </div>
      <h2 style="text-align:center; color:#00aaff;">Email Verification OTP</h2>
      <p style="font-size:16px; text-align:center;">To verify your email address, please use the following OTP:</p>
      <div style="font-size:32px; font-weight:bold; text-align:center; background:#1a1a1a; padding:12px 0; border-radius:8px; letter-spacing:2px; margin:20px 0;">
        ${otp}
      </div>
      <p style="text-align:center; font-size:14px; color:#bbbbbb;">
        This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email.
      </p>
      <div style="text-align:center; margin-top:30px;">
        <a href="https://wandercall.com" style="color:#00aaff; text-decoration:none; font-size:14px;">Visit Wandercall</a>
      </div>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending OTP');
      }
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP for email verification (no token required)
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (!isValidOTP(user, otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();
    const token = generateToken(user);
    res.status(200).json({ message: 'Email verified successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// search endpoint 
app.get('/products/search', async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) {
      const products = await Product.find();
      return res.json(products);
    }
    const regex = new RegExp(`^${query}`, 'i'); // Match titles starting with query, case-insensitive
    const products = await Product.find({ title: regex });
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
});

// Wishlist routes (require token)
app.post('/wishlist/add', verifyToken, async (req, res) => {
  const { productId } = req.body;
  try {
    const userId = req.user.id;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      console.log('Product not found for ID:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();
    const populatedItem = await Wishlist.findById(wishlistItem._id).populate('productId');
    res.status(200).json(populatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/wishlist/remove', verifyToken, async (req, res) => {
  const { productId } = req.body;
  try {
    const userId = req.user.id;
    await Wishlist.deleteOne({ userId, productId });
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await Wishlist.find({ userId }).populate('productId');
    const validItems = wishlistItems.filter(item => item.productId !== null);
    res.status(200).json(validItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cart routes (require token)
app.get('/cart', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/cart/add', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ productId, quantity: quantity || 1 });
    }
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/cart/remove', verifyToken, async (req, res) => {
  const { productId } = req.body;
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/cart/update', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    item.quantity = quantity;
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Checkout route (requires token)
app.post('/checkout', verifyToken, async (req, res) => {
  const {
    productId,
    title,
    state,
    city,
    companyName,
    providerName,
    selectedDate,
    participants,
    totalPrice,
    gst,
    discount,
    coupon,
  } = req.body;

  try {
    const checkout = new Checkout({
      userId: req.user.id,
      productId,
      title,
      state,
      city,
      companyName,
      providerName,
      selectedDate,
      participants,
      totalPrice,
      gst,
      discount,
      coupon,
    });
    await checkout.save();
    res.status(201).json({ message: 'Booking successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all addresses for the user
app.get('/addresses', verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    const user = await User.findById(req.user.id).select('activeAddressId');
    res.json({ addresses, activeAddressId: user.activeAddressId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new address
app.post('/addresses', verifyToken, async (req, res) => {
  const { address, locality, city, state, zip, phone, landmark, alternatePhone } = req.body;
  try {
    const newAddress = new Address({
      userId: req.user.id,
      address,
      locality,
      city,
      state,
      zip,
      phone,
      landmark,
      alternatePhone,
    });
    await newAddress.save();
    const user = await User.findById(req.user.id);
    if (!user.activeAddressId) {
      user.activeAddressId = newAddress._id;
      await user.save();
    }
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT to update an address
app.put('/addresses/:id', verifyToken, async (req, res) => {
  const { address, locality, city, state, zip, phone, landmark, alternatePhone } = req.body;
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { address, locality, city, state, zip, phone, landmark, alternatePhone },
      { new: true }
    );
    if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });
    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE an address
app.delete('/addresses/:id', verifyToken, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    const user = await User.findById(req.user.id);
    if (user.activeAddressId && user.activeAddressId.toString() === req.params.id) {
      user.activeAddressId = null;
      await user.save();
    }
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT to set active address
app.put('/user/active-address', verifyToken, async (req, res) => {
  const { addressId } = req.body;
  try {
    const address = await Address.findOne({ _id: addressId, userId: req.user.id });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    const user = await User.findById(req.user.id);
    user.activeAddressId = addressId;
    await user.save();
    res.json({ message: 'Active address updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// console.log('Static files path:', path.join(__dirname, '../client/dist'));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
  console.log('Server is running');
});