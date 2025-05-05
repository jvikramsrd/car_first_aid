import express from 'express';
import { saveDiagnosis, getDiagnosisHistory, getDiagnosis } from '../controllers/diagnosisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (authentication required)
router.post('/', protect, saveDiagnosis);
router.get('/history', protect, getDiagnosisHistory);
router.get('/:id', protect, getDiagnosis);

export default router; 