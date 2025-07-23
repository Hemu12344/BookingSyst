const driverSchema = new mongoose.Schema({
  name: String,
  phone: String,
  licenseNumber: String,
  vehicleNumber:String,
  vehicleType:String,
  isAvailable: { type:String, eval:["Busy","Availble"],default:"Availble" },
  currentLocation: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
