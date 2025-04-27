import mongoose from 'mongoose';

const mechanicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  specialization: [{
    type: String,
    enum: ['engine', 'brakes', 'electrical', 'transmission', 'cooling', 'suspension', 'exhaust', 'general']
  }],
  contact: {
    phone: String,
    email: String
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

const Mechanic = mongoose.model('Mechanic', mechanicSchema);

export default Mechanic; 