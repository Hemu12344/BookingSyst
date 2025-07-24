// server.js or index.js
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userModel = require('./Database/user');
const bookingModel = require('./Database/booking');
const driverModel=require('./Database/driver')
const app = express();
const PORT = process.env.PORT || 5000;
const KEY = process.env.API_KEY;

// Allowed CORS origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://bookmycab.netlify.app'
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== API ROUTES ==========

// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, role, isAccept } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).json({ isExist: true, message: "User Already Exist" });
    if (password.length < 6) return res.json({ message: "Pass length must be minimum 6" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, pass: hashed, role, isAccept });
    await user.save();
    res.status(200).json({ message: "Registration Successful" });
  } catch (err) {
    res.status(500).json({ message: "Some Error Occurred", error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user found" });

    const match = await bcrypt.compare(password, user.pass);
    if (!match) return res.json({ message: "Incorrect password" });

    const token = jwt.sign(
      { userName: user.name, userId: user._id, email: user.email, role: user.role,newUser:user.newUser },
      KEY,
      { expiresIn: '7d' }
    );
    res.status(200).json({ message: "Login Successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Auth check
app.get('/api/checkUser', (req, res) => {
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, KEY);
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Book Now
app.post('/api/bookNow', async (req, res) => {
  const { token, date, time, carType, drop, pick } = req.body;

  try {
    const decoded = jwt.verify(token, KEY);
    const user = await userModel.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await bookingModel.find({ employeeId: decoded.userId });
    const hasActiveBooking = existing.some(v => v.status === "booked");
    if (hasActiveBooking) return res.status(409).json({ message: "User already has a ride" });

    const book = new bookingModel({
      employeeId: decoded.userId,
      pickupLocation: pick,
      dropLocation: drop,
      date,
      time,
      cabType: carType,
      status: "booked"
    });

    await book.save();
    res.status(200).json({ message: "Booking successfully created" });

  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

// My Bookings
app.get('/api/myBookings', async (req, res) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, KEY);
    const booking = await bookingModel.find({ employeeId: decoded.userId });
    if (!booking) return res.status(404).json({ message: "No booking found" });
    res.status(200).json({ booking });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ✅ Cancel Booking
app.put('/api/cancelBooking/:id', async (req, res) => {
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
// Delete booking

app.delete('/api/DeleteBooking/:Bookid', async (req, res) => {
  const token = req.headers.authorization;
  const bookingID = req.params.Bookid;

  try {
    if (!bookingID) return res.status(400).json({ message: "Booking ID not provided" });

    const decoded = jwt.verify(token, KEY); // ✅ Fix: use 'KEY', not 'API_KEY'

    const booking = await bookingModel.findOneAndDelete({
      _id: bookingID,
      employeeId: decoded.userId, // ensures user can only delete their own booking
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    res.json({ message: "Booking deleted successfully", deletedBooking: booking });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(401).json({ message: "Unauthorized or error occurred", error: error.message });
  }
});


//Driver Registration
// ✅ Correct: Driver Registration Route
app.post('/api/driverRegister', async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      licenseNumber,
      vehicleNumber,
      vehicleType,
      isAvailable,
      lat,
      lng,
    } = req.body;

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, KEY);

    const check = await userModel.findOne({ email: decoded.email });
    if (!check) {
      return res.status(404).json({ message: "User not found" });
    }

    await userModel.findOneAndUpdate(
      { _id: check._id },
      { newUser: false },
      { new: true }
    );

    const newData = new driverModel({
      userId:check._id,
      name,
      phone,
      location,
      licenseNumber,
      vehicleNumber,
      vehicleType,
      isAvailable,
      currentLocation: {
        lat,
        lng
      }
    });

    await newData.save();
    return res.status(200).json({ message: "Driver registered successfully" });

  } catch (error) {
    console.error("Driver registration error:", error.message);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
});


app.get('/api/driverDetail',async(req,res)=>{
  const token = req.headers.authorization
  
  const decoded = jwt.verify(token,KEY);
  // console.log(decoded);
  try {
    if(!token){
      return res.json({message:"No token found"})
    }
    const user=await driverModel.findOne({userId:decoded.userId});
    
    res.status(200).json({ user});
  } catch (error) {
    res.status(404).json({message:error});
  }
})
// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Static file serving

const reactBuildPath = path.resolve(__dirname, '..', 'Front','bookcab','dist');
app.use(express.static(reactBuildPath));

// Fallback route for React Router
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.resolve(reactBuildPath, 'index.html'));
});



// Debug route log
console.log("=== Registered Express Routes ===");
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
    console.log(`${methods} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
      console.log(`${methods} ${handler.route.path}`);
    });
  }
});


// Server start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
