import express from 'express';
import { generateAIDiagnosis } from '../controllers/aiDiagnoseController.js';

const router = express.Router();

router.post('/', generateAIDiagnosis);

export default router;
