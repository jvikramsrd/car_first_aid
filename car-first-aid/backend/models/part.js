import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
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
}, {
  timestamps: true
});

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter part name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter part description']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['brakes', 'engine', 'ignition', 'electrical', 'suspension', 'transmission', 'cooling', 'other'],
      message: '{VALUE} is not a valid category'
    }
  },
  price: {
    type: Number,
    required: [true, 'Please enter part price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  brand: {
    type: String,
    required: [true, 'Please enter brand name']
  },
  compatibleCars: [{
    make: String,
    model: String,
    year: Number
  }],
  stock: {
    type: Number,
    required: [true, 'Please enter stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate average rating when reviews are modified
partSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

const Part = mongoose.model('Part', partSchema);

export default Part;
