import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  diagnoseIssue,
  saveDiagnosis,
  getDiagnosisHistory
} from '../controllers/diagnoseController.js';

const router = express.Router();

// Public routes
router.post('/', diagnoseIssue);

// Protected routes (require authentication)
router.post('/save', protect, saveDiagnosis);
router.get('/history', protect, getDiagnosisHistory);

export default router;
