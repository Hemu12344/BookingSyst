const mongoose = require('mongoose');
const driver = require('./driver');
const bookingSchema =mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  dropLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  date: Date,
  time: String,
  cabType: String,
  cancle:Date,
  tripType: { type: String, enum: ['one-way', 'round-trip'], default: 'one-way' },
  status: {
    type: String,
    enum: ['booked', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'booked'
  },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  cost: Number,
  tracking:[{type:mongoose.Schema.Types.ObjectId,ref:'driver'},]
}, { timestamps: true });

module.exports =mongoose.model('booking',bookingSchema)