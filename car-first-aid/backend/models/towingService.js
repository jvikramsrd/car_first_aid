import mongoose from 'mongoose';

const towingServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    phone: String,
    email: String
  },
  availability: {
    type: Boolean,
    default: true
  },
  serviceAreas: [String],
  rates: {
    baseFee: Number,
    perMile: Number
  }
}, {
  timestamps: true
});

const TowingService = mongoose.model('TowingService', towingServiceSchema);
export default TowingService;
