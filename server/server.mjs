import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import User from './models/model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { generateToken, verifyToken } from './middlewares/middleware.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
    const user = new User({ firstname, lastname, phone, email, password, verificationCode });
    await user.save();

    const mailOptions = {
      from: 'From Gabriyol',
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Verification code sent');
    });
  } catch (err) {
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
    await user.save();
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
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
      from: 'anmolsinha4321@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Your new verification code is: ${verificationCode}`,
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

// Get user details
app.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('firstname lastname email phone dob gender');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/user', verifyToken, async (req, res) => {
  try {
    const { firstname, lastname, email, phone, dob, gender } = req.body;
    const updateData = { firstname, lastname, email, phone, dob, gender };

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

app.listen(process.env.PORT, () => {
  console.log('Server is running');
});