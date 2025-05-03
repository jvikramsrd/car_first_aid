import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDiagnoses, createDiagnosis, saveAiDiagnosis, diagnoseIssue, saveDiagnosis } from '../controllers/diagnoseController.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', protect, createDiagnosis);
router.post('/ai', protect, saveAiDiagnosis);
router.post('/save', protect, saveDiagnosis);

export default router; 