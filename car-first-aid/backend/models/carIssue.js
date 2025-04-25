import mongoose from 'mongoose';

const carIssueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous diagnoses
  },
  symptom: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  carDetails: {
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    }
  },
  aiResponse: {
    type: String,
    required: false
  },
  isAiGenerated: {
    type: Boolean,
    default: false
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  possibleCauses: [{
    type: String
  }],
  recommendedAction: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a text index for search functionality
carIssueSchema.index({ symptom: 'text' });

const CarIssue = mongoose.model('CarIssue', carIssueSchema);
export default CarIssue;
