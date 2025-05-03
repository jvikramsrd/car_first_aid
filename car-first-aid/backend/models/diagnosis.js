import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptom: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  causes: [{
    type: String,
    required: true
  }],
  solutions: [{
    type: String,
    required: true
  }],
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
  estimatedCost: {
    type: String,
    default: 'Unknown'
  },
  safetyImplications: {
    type: String,
    default: 'Unknown'
  },
  urgencyLevel: {
    type: Number,
    default: 3
  },
  additionalNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create a text index for search functionality
diagnosisSchema.index({ symptom: 'text', details: 'text' });

export default mongoose.model('Diagnosis', diagnosisSchema); 