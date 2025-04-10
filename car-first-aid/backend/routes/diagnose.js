import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  diagnoseIssue,
  saveDiagnosis,
  getDiagnosisHistory
} from '../controllers/diagnoseController.js';

const router = express.Router();

router.post('/', protect, diagnoseIssue);
router.post('/save', protect, saveDiagnosis);
router.get('/history', protect, getDiagnosisHistory);

export default router;
