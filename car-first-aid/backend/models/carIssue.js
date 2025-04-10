import mongoose from 'mongoose';

const carIssueSchema = new mongoose.Schema({
  symptom: {
    type: String,
    required: true,
    trim: true
  },
  possibleCauses: [{
    type: String,
    required: true
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  recommendedAction: {
    type: String,
    required: true
  },
  needsMechanic: {
    type: Boolean,
    default: false
  },
  needsTowing: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['engine', 'brakes', 'electrical', 'transmission', 'cooling', 'suspension', 'exhaust', 'other'],
    default: 'other'
  },
  keywords: [{
    type: String
  }]
}, {
  timestamps: true
});

// Create a text index for search functionality
carIssueSchema.index({ symptom: 'text', keywords: 'text' });

const CarIssue = mongoose.model('CarIssue', carIssueSchema);
export default CarIssue;
