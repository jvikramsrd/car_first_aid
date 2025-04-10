import express from 'express';
import { OpenAI } from 'openai';
import { protect } from '../middleware/authMiddleware.js';
import { saveAiDiagnosis } from '../controllers/diagnoseController.js';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', protect, async (req, res) => {
  try {
    const { symptom, details, carDetails } = req.body;
    
    const prompt = `As an expert automotive technician, analyze this car issue:
Make: ${carDetails.make}
Model: ${carDetails.model}
Year: ${carDetails.year}
Symptom: ${symptom}
Details: ${details}

Provide:
1. Likely causes (list top 3)
2. Severity (low/medium/high)
3. Recommended actions
4. Estimated repair cost range
5. Urgency level (1-5)
6. DIY check tips`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert automotive diagnostic assistant. Provide accurate, concise technical analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const aiDiagnosis = {
      symptom,
      details,
      carDetails,
      aiResponse: response.choices[0].message.content,
      timestamp: new Date()
    };

    // Save to database
    await saveAiDiagnosis(req.user._id, aiDiagnosis);

    res.json({
      success: true,
      data: aiDiagnosis
    });
  } catch (err) {
    console.error('AI diagnosis error:', err);
    res.status(500).json({
      success: false,
      message: 'AI diagnosis failed'
    });
  }
});

export default router;
