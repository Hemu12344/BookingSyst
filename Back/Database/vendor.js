const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  companyName: String,
  location: String,
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Vendor', vendorSchema);
