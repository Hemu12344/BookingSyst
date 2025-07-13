const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const userMode = require('./Database/user');
const bcrypt = require('bcrypt');
const bookingModel=require('./Database/booking')
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // ✅ Needed to parse JSON body
app.use(express.urlencoded({ extended: true }));
const KEY = process.env.API_KEY || 'your_default_key'; 

// ----- Signup Route (no change)
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, isAccept } = req.body;

    const checked = await userMode.findOne({ email });

    if (checked) {
      return res.status(400).json({ isExist: true, message: "User Already Exist" });
    }

    if (password.length < 6) {
      return res.json({ message: "Pass length must be minimum 6" });
    }

    const salt = 10;
    const hash = await bcrypt.hash(password, salt);

    const user = new userMode({
      name,
      email,
      pass: hash,
      role,
      isAccept,
    });

    await user.save();
    res.status(200).json({ message: "Registration Successful" });
  } catch (err) {
    res.status(500).json({ message: "Some Error Occurred", error: err.message });
  }
});

// ----- Login Route (updated to log request data)
app.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const check = await userMode.findOne({ email });

    if (!check) {
      return res.status(404).json({ message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, check.pass);

    if (!isMatch) {
      return res.json({ message: "Incorrect password" });
    }

    const payLoad = {
      userId:check._id,
      email: check.email,
      role: check.role
    };

    const token = jwt.sign(payLoad, KEY, { expiresIn: '7d' });

    return res.status(200).json({ message: "Login Successfully", token });
    
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

//Check user

app.get('/checkUser', (req, res) => {
  const token = req.headers.authorization;
  
  const check=jwt.decode(token,KEY)
  if(!check) return;
  res.json({user:check})


});





// Booking 

app.post("/bookNow", async (req, res) => {
  const { token, date, time, carType, drop, pick } = req.body;
  const check=jwt.decode(token,KEY)
  const user = await userMode.findById(check.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const existingBooking = await bookingModel.findOne({ employeeId: check.userId });
    if (existingBooking) {
      return res.status(409).json({ message: "User already have Ride" });
    }

  try {
    const book = new bookingModel({
      employeeId:check.userId,
      pickupLocation: pick,
      dropLocation: drop,
      date: date,
      time: time,
      cabType: carType
    });

    await book.save();
    res.status(200).json({ message: "Booking successfully booked" });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Some error occurred", error: error.message });
  }
});

//My Booking


app.get('/myBookings',async (req,res)=>{
  const token=req.headers.authorization
  const check=jwt.decode(token,KEY)
  if(!check){
    return res.status(404).json({message:"Token not valid"})
  }
  try {
    const userId=check.userId;

    const userBooking = await bookingModel.findOne({employeeId:userId});

    if(!userBooking){
      return res.json({message:"User Have No booking"})
    }
    return res.status(200).json({booking:userBooking})
  } catch (error) {
    return res.json({message:"Some error occur"})
  }
})


// Cancle booking 

app.put('/cancleBooking/:id', async (req, res) => {
  const bookId = req.params.id;

  if (!bookId) {
    return res.status(400).json({ message: "Booking ID not provided" });
  }

  try {
    const update = await bookingModel.findByIdAndUpdate(
      {_id:bookId},
      { status: 'cancelled',cancle:Date.now()},
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking canceled successfully', update });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});


app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
