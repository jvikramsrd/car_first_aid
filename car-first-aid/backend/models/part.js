import mongoose from 'mongoose';

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['brakes', 'engine', 'ignition', 'electrical', 'suspension', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  image: {
    type: String
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Part = mongoose.model('Part', partSchema);

export default Part;
