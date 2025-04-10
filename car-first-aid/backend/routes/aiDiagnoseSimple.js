import express from 'express';
import { OpenAI } from 'openai';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', protect, async (req, res) => {
  try {
    const { symptom, details, carDetails } = req.body;
    
    const prompt = `As an expert automotive technician, analyze this car issue:
Car: ${carDetails.make} ${carDetails.model} (${carDetails.year})
Problem: ${symptom}
Details: ${details}

Provide a concise solution in this format:
**Diagnosis:** [clear diagnosis]
**Solution:** [step-by-step solution]
**Urgency:** [1-5 rating]
**Safety Notes:** [important warnings]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ solution: response.choices[0].message.content });
  } catch (err) {
    console.error('AI diagnosis error:', err);
    res.status(500).json({ error: 'Diagnosis failed. Please try again.' });
  }
});

export default router;
