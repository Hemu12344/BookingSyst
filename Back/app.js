const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userModel = require('./Database/user');
const bookingModel = require('./Database/booking');

const PORT = process.env.PORT || 5000;
const KEY = process.env.API_KEY;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, isAccept } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).json({ isExist: true, message: "User Already Exist" });
    if (password.length < 6) return res.json({ message: "Pass length must be minimum 6" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, pass: hashed, role, isAccept });
    await user.save();
    res.status(200).json({ message: "Registration Successful"});
  } catch (err) {
    res.status(500).json({ message: "Some Error Occurred", error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user found" });
    const match = await bcrypt.compare(password, user.pass);
    if (!match) return res.json({ message: "Incorrect password" });

    const token = jwt.sign({ userName:user.name,userId: user._id, email: user.email, role: user.role }, KEY, { expiresIn: '7d' });
    res.status(200).json({ message: "Login Successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/checkUser', (req, res) => {
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, KEY);
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// -------------------- BOOKING ROUTES --------------------
app.post('/bookNow', async (req, res) => {
  const { token, date, time, carType, drop, pick } = req.body;
  try {
    const decoded = jwt.verify(token, KEY);
    const user = await userModel.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const existing = await bookingModel.findOne({ employeeId: decoded.userId });
    if (existing) return res.status(409).json({ message: "User already have Ride" });

    const book = new bookingModel({
      employeeId: decoded.userId,
      pickupLocation: pick,
      dropLocation: drop,
      date,
      time,
      cabType: carType
    });

    await book.save();
    res.status(200).json({ message: "Booking successfully booked" });
  } catch (err) {
    res.status(500).json({ message: "Some error occurred", error: err.message });
  }
});

app.get('/myBookings', async (req, res) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, KEY);
    const booking = await bookingModel.findOne({ employeeId: decoded.userId });
    if (!booking) return res.status(404).json({ message: "No booking found" });
    res.status(200).json({ booking });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.put('/cancleBooking/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const update = await bookingModel.findByIdAndUpdate(
      id,
      { status: 'cancelled', cancle: Date.now() },
      { new: true }
    );
    if (!update) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking canceled successfully', update });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));