import Diagnosis from '../models/diagnosis.js';
import asyncHandler from 'express-async-handler';

// @desc    Save a new diagnosis
// @route   POST /api/diagnosis
// @access  Private
const saveDiagnosis = asyncHandler(async (req, res) => {
  try {
    const {
      symptom,
      details,
      severity,
      causes,
      solutions,
      carDetails,
      aiResponse,
      isAiGenerated,
      estimatedCost,
      safetyImplications,
      urgencyLevel,
      additionalNotes
    } = req.body;

    const diagnosis = await Diagnosis.create({
      user: req.user._id,
      symptom,
      details,
      severity,
      causes,
      solutions,
      carDetails,
      aiResponse,
      isAiGenerated,
      estimatedCost,
      safetyImplications,
      urgencyLevel,
      additionalNotes
    });

    res.status(201).json({
      success: true,
      data: diagnosis
    });
  } catch (error) {
    console.error('Error saving diagnosis:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving diagnosis',
      error: error.message
    });
  }
});

// @desc    Get diagnosis history for the authenticated user
// @route   GET /api/diagnosis/history
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
      message: 'Error fetching diagnosis history'
    });
  }
});

// @desc    Get a single diagnosis
// @route   GET /api/diagnosis/:id
// @access  Private
const getDiagnosis = asyncHandler(async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select('-__v');

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    res.status(200).json({
      success: true,
      data: diagnosis
    });
  } catch (error) {
    console.error('Error fetching diagnosis:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching diagnosis'
    });
  }
});

export { saveDiagnosis, getDiagnosisHistory, getDiagnosis }; 