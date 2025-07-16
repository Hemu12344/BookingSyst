const driverSchema = new mongoose.Schema({
  name: String,
  phone: String,
  licenseNumber: String,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
