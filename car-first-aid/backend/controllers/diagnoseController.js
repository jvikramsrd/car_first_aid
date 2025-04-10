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
// @access  Private
const saveAiDiagnosis = asyncHandler(async (userId, diagnosisData) => {
  try {
    const diagnosis = await CarIssue.create({
      user: userId,
      symptom: diagnosisData.symptom,
      details: diagnosisData.details,
      carDetails: diagnosisData.carDetails,
      aiResponse: diagnosisData.aiResponse,
      isAiGenerated: true,
      severity: 'medium', // Default severity
      possibleCauses: [], // Will be parsed from AI response
      recommendedAction: '' // Will be parsed from AI response
    });
    return diagnosis;
  } catch (error) {
    console.error('Error saving AI diagnosis:', error);
    throw error;
  }
});

// @desc    Diagnose car issue
// @route   POST /api/diagnose
// @access  Private
const diagnoseIssue = asyncHandler(async (req, res) => {
  const { symptom, details, carDetails, location } = req.body;
  
  // Your diagnosis logic here
  const diagnosis = await CarIssue.create({
    user: req.user._id,
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

// @desc    Get diagnosis history
// @route   GET /api/diagnose/history
// @access  Private
const getDiagnosisHistory = asyncHandler(async (req, res) => {
  // Your history logic here
});

export { 
  getDiagnoses, 
  createDiagnosis, 
  saveAiDiagnosis,
  diagnoseIssue,
  saveDiagnosis,
  getDiagnosisHistory 
};
