import asyncHandler from 'express-async-handler';
import CarIssue from '../models/carIssue.js';

// @desc    Get all diagnoses
// @route   GET /api/diagnoses
// @access  Public
const getDiagnoses = asyncHandler(async (req, res) => {
  const diagnoses = await CarIssue.find();
  res.json(diagnoses);
});

// @desc    Create new diagnosis
// @route   POST /api/diagnoses
// @access  Public
const createDiagnosis = asyncHandler(async (req, res) => {
  const { symptom, possibleCauses, severity, recommendedAction } = req.body;

  const diagnosis = await CarIssue.create({
    symptom,
    possibleCauses,
    severity,
    recommendedAction
  });

  res.status(201).json(diagnosis);
});

// @desc    Save AI diagnosis
// @route   POST /api/ai-diagnose
// @access  Public
const saveAiDiagnosis = asyncHandler(async (userId, diagnosisData) => {
  try {
    console.log('Attempting to save AI diagnosis:', JSON.stringify(diagnosisData, null, 2));

    if (!diagnosisData || !diagnosisData.symptom || !diagnosisData.details || !diagnosisData.carDetails) {
      console.error('Invalid diagnosis data:', diagnosisData);
      throw new Error('Invalid diagnosis data');
    }

    // Create a new diagnosis document
    const diagnosis = new CarIssue({
      user: userId, // This can be null for anonymous diagnoses
      symptom: diagnosisData.symptom,
      details: diagnosisData.details,
      carDetails: diagnosisData.carDetails,
      aiResponse: diagnosisData.aiResponse,
      isAiGenerated: true,
      severity: 'medium', // Default severity
      possibleCauses: [], // Will be parsed from AI response
      recommendedAction: '', // Will be parsed from AI response
      timestamp: new Date()
    });

    // Validate the document before saving
    const validationError = diagnosis.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      throw new Error('Invalid diagnosis data format');
    }

    // Save the document
    const savedDiagnosis = await diagnosis.save();
    console.log('Successfully saved diagnosis:', savedDiagnosis);
    return savedDiagnosis;
  } catch (error) {
    console.error('Error saving AI diagnosis:', error);
    if (error.name === 'ValidationError') {
      throw new Error('Invalid diagnosis data format: ' + error.message);
    }
    throw error;
  }
});

// @desc    Diagnose car issue
// @route   POST /api/diagnose
// @access  Public
const diagnoseIssue = asyncHandler(async (req, res) => {
  const { symptom, details, carDetails, location } = req.body;
  
  const diagnosis = await CarIssue.create({
    user: null, // Allow anonymous diagnoses
    symptom,
    details,
    carDetails,
    location,
    severity: 'medium',
    possibleCauses: [],
    recommendedAction: ''
  });

  res.status(201).json(diagnosis);
});

// @desc    Save diagnosis
// @route   POST /api/diagnose/save
// @access  Private
const saveDiagnosis = asyncHandler(async (req, res) => {
  // Your save logic here
});

// @desc    Get diagnosis history for a user
// @route   GET /api/diagnose/history
// @access  Private
const getDiagnosisHistory = asyncHandler(async (req, res) => {
  try {
    const diagnoses = await CarIssue.find({ user: req.user._id })
      .sort({ timestamp: -1 }) // Sort by newest first
      .select('-__v'); // Exclude version key

    res.json(diagnoses);
  } catch (error) {
    console.error('Error fetching diagnosis history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnosis history'
    });
  }
});

export { 
  getDiagnoses, 
  createDiagnosis, 
  saveAiDiagnosis,
  diagnoseIssue,
  saveDiagnosis,
  getDiagnosisHistory 
};
