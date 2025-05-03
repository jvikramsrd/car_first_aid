import asyncHandler from 'express-async-handler';
import Diagnosis from '../models/diagnosis.js';

// @desc    Get all diagnoses
// @route   GET /api/diagnoses
// @access  Public
const getDiagnoses = asyncHandler(async (req, res) => {
  const diagnoses = await Diagnosis.find();
  res.json(diagnoses);
});

// @desc    Create new diagnosis
// @route   POST /api/diagnoses
// @access  Public
const createDiagnosis = asyncHandler(async (req, res) => {
  const { symptom, details, severity, causes, solutions, carDetails } = req.body;

  const diagnosis = await Diagnosis.create({
    user: req.user._id,
    symptom,
    details,
    severity,
    causes,
    solutions,
    carDetails
  });

  res.status(201).json(diagnosis);
});

// @desc    Save AI diagnosis
// @route   POST /api/ai-diagnose
// @access  Public
const saveAiDiagnosis = asyncHandler(async (req, res) => {
  try {
    const { symptom, details, carDetails, aiResponse, severity, causes, solutions } = req.body;

    const diagnosis = await Diagnosis.create({
      user: req.user._id,
      symptom,
      details,
      carDetails,
      aiResponse,
      isAiGenerated: true,
      severity,
      causes,
      solutions
    });

    res.status(201).json(diagnosis);
  } catch (error) {
    console.error('Error saving AI diagnosis:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving AI diagnosis',
      error: error.message
    });
  }
});

// @desc    Diagnose car issue
// @route   POST /api/diagnose
// @access  Public
const diagnoseIssue = asyncHandler(async (req, res) => {
  const { symptom, details, carDetails } = req.body;
  
  const diagnosis = await Diagnosis.create({
    user: req.user?._id || null,
    symptom,
    details,
    carDetails,
    severity: 'medium',
    causes: [],
    solutions: []
  });

  res.status(201).json(diagnosis);
});

// @desc    Save diagnosis
// @route   POST /api/diagnose/save
// @access  Private
const saveDiagnosis = asyncHandler(async (req, res) => {
  const { symptom, details, severity, causes, solutions, carDetails } = req.body;

  const diagnosis = await Diagnosis.create({
    user: req.user._id,
    symptom,
    details,
    severity,
    causes,
    solutions,
    carDetails
  });

  res.status(201).json(diagnosis);
});

// @desc    Get diagnosis history for a user
// @route   GET /api/diagnose/history
// @access  Private
const getDiagnosisHistory = asyncHandler(async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: diagnoses
    });
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
