const mongoose =require('mongoose')
const driverSchema = new mongoose.Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  phone: String,
  location:String,
  licenseNumber: String,
  vehicleNumber:String,
  vehicleType:String,
  isAvailable: { type:String,default:"available" },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  bookings:[]
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
