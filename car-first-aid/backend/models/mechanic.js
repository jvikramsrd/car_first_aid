import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
});

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
      required: true
    }
  },
  specialization: [{
    type: String,
    enum: [
      'Engine Diagnostics',
      'Battery Services',
      'Transmission Repair',
      'Clutch Systems',
      'General Service',
      'Suspension',
      'Paint & Dent',
      'Insurance Claims',
      'Electricals',
      'Diagnostics'
    ]
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
  },
  bio: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    required: true
  }],
  reviews: [reviewSchema]
}, {
  timestamps: true
});

// Create 2dsphere index for location-based queries
mechanicSchema.index({ location: '2dsphere' });

const Mechanic = mongoose.model('Mechanic', mechanicSchema);
export default Mechanic;
