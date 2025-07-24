const { model } = require("mongoose");
const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  vehicleNumber: String,
  type: { type: String },
  model: String,
  capacity: Number,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports=mongoose.model('vechile',vehicleSchema);