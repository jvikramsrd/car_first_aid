import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { saveDiagnosis, getDiagnosisHistory, getDiagnosis } from '../controllers/diagnosisController.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', protect, saveDiagnosis);
router.get('/history', protect, getDiagnosisHistory);
router.get('/:id', protect, getDiagnosis);

export default router; 