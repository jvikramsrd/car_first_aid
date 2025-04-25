import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getDiagnoses,
  createDiagnosis,
  diagnoseIssue,
  getDiagnosisHistory,
  saveAiDiagnosis
} from '../controllers/diagnoseController.js';
import { generateAIDiagnosis } from '../controllers/aiDiagnoseController.js';

const router = express.Router();

// Public routes
router.post('/diagnose', diagnoseIssue);
router.post('/ai-diagnose', generateAIDiagnosis);

// Protected routes (require authentication)
router.get('/history', protect, getDiagnosisHistory);
router.post('/save', protect, createDiagnosis);
router.get('/', protect, getDiagnoses);

export default router; 