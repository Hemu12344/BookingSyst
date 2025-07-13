const vehicleSchema = new mongoose.Schema({
  vehicleNumber: String,
  type: { type: String }, // Sedan, SUV, etc.
  model: String,
  capacity: Number,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
