import { HfInference } from '@huggingface/inference';
import { saveAiDiagnosis } from './diagnoseController.js';

// Debug log for API key
const apiKey = process.env.HUGGING_FACE_API_KEY;
console.log('Initializing Hugging Face client with API key:', apiKey ? 'Present' : 'Missing');

// Initialize Hugging Face client with retry mechanism
let hf;
let retryCount = 0;
const MAX_RETRIES = 3;

const initializeHuggingFace = async () => {
  try {
    if (!apiKey) {
      throw new Error('Hugging Face API key is not configured');
    }
    hf = new HfInference(apiKey);
    console.log('Successfully initialized Hugging Face client');
    return true;
  } catch (error) {
    console.error('Error initializing Hugging Face client:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying initialization (attempt ${retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      return initializeHuggingFace();
    }
    return false;
  }
};

// Initialize on startup
initializeHuggingFace();

// Validation helper
const validateRequest = (body) => {
  const { symptom, details, carDetails } = body;
  const errors = [];

  if (!symptom) errors.push('Symptom is required');
  if (!details) errors.push('Details are required');
  if (!carDetails) {
    errors.push('Car details are required');
  } else {
    if (!carDetails.make) errors.push('Car make is required');
    if (!carDetails.model) errors.push('Car model is required');
    if (!carDetails.year) errors.push('Car year is required');
    
    // Validate year format
    if (carDetails.year && (isNaN(carDetails.year) || carDetails.year < 1900 || carDetails.year > new Date().getFullYear() + 1)) {
      errors.push('Invalid car year');
    }
  }

  return errors;
};

export const generateAIDiagnosis = async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    // Validate request
    const validationErrors = validateRequest(req.body);
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if Hugging Face client is initialized
    if (!hf) {
      console.error('Hugging Face client not initialized, attempting to initialize...');
      const initialized = await initializeHuggingFace();
      if (!initialized) {
        throw new Error('Failed to initialize Hugging Face client after retries');
      }
    }

    const { symptom, details, carDetails } = req.body;
    
    console.log('Processing request for:', {
      symptom,
      details,
      carMake: carDetails.make,
      carModel: carDetails.model,
      carYear: carDetails.year
    });

    if (!apiKey) {
      console.error('Hugging Face API key is missing');
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Missing API key.'
      });
    }
    
    const prompt = `Analyze this car issue as an automotive expert:
Car: ${carDetails.year} ${carDetails.make} ${carDetails.model}
Problem: ${symptom}
Details: ${details}

Provide a detailed analysis including:
1. Most likely causes
2. Severity level
3. Required actions
4. Estimated costs
5. Safety implications`;

    console.log('Sending prompt to Hugging Face:', prompt);

    try {
      console.log('Making API call to Hugging Face...');
      const result = await Promise.race([
        hf.textGeneration({
          model: 'gpt2',
          inputs: prompt,
          parameters: {
            max_new_tokens: 256,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI request timeout')), 30000)
        )
      ]);

      console.log('Received response from Hugging Face:', {
        responseReceived: !!result,
        textGenerated: !!result?.generated_text,
        textLength: result?.generated_text?.length
      });

      if (!result || !result.generated_text) {
        console.error('Invalid response from AI model:', result);
        throw new Error('Invalid response from AI model');
      }

      // Process the AI response
      const aiResponse = result.generated_text.trim();
      
      // Create a structured response based on the symptom
      const structuredResponse = {
        problem: symptom,
        causes: [
          `${carDetails.make} ${carDetails.model} ${symptom.toLowerCase()} could indicate:`,
          "1. Sensor malfunction or electrical issues",
          "2. System-specific component failure",
          "3. Regular maintenance needed"
        ],
        solutions: [
          "1. Use OBD scanner to check error codes",
          `2. Visit authorized ${carDetails.make} service center`,
          "3. Check related system components",
          "4. Consider immediate inspection if safety-critical"
        ],
        severity: symptom.includes("WARNING") || symptom.includes("BRAKE") ? "high" : "medium",
        estimatedCosts: "$50 - $500 (diagnostic fee + potential repairs)",
        urgencyLevel: symptom.includes("WARNING") || symptom.includes("BRAKE") ? "4/5" : "3/5",
        aiResponse: aiResponse
      };

      // Add specific recommendations based on the symptom
      if (symptom.includes("WARNING LIGHTS")) {
        structuredResponse.causes = [
          "1. Check Engine Light - Engine management system issue",
          "2. ABS/Brake Warning - Brake system malfunction",
          "3. Battery Light - Charging system problem",
          "4. Oil Pressure Light - Low oil pressure or level"
        ];
        structuredResponse.solutions = [
          "1. Perform diagnostic scan for error codes",
          "2. Check fluid levels and system conditions",
          "3. Inspect related components and wiring",
          "4. Visit a certified mechanic for proper diagnosis"
        ];
      }

      const aiDiagnosis = {
        symptom,
        details,
        carDetails,
        aiResponse: JSON.stringify(structuredResponse),
        severity: structuredResponse.severity,
        possibleCauses: structuredResponse.causes,
        recommendedAction: structuredResponse.solutions.join("; "),
        timestamp: new Date(),
        user: req.user?._id
      };

      console.log('Preparing to save diagnosis:', JSON.stringify(aiDiagnosis, null, 2));

      // Save to database with user ID if available
      const savedDiagnosis = await saveAiDiagnosis(req.user?._id, aiDiagnosis);
      console.log('Successfully saved diagnosis:', JSON.stringify(savedDiagnosis, null, 2));

      return res.json({
        success: true,
        data: {
          ...savedDiagnosis.toObject(),
          ...structuredResponse
        }
      });
    } catch (aiError) {
      console.error('Hugging Face API error:', aiError);
      
      // Specific error handling
      if (aiError.message.includes('timeout')) {
        return res.status(504).json({
          success: false,
          message: 'AI service timeout. Please try again.'
        });
      }
      
      if (aiError.response?.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.'
        });
      }
      
      throw new Error(`AI model error: ${aiError.message}`);
    }
  } catch (err) {
    console.error('AI diagnosis error:', err);
    
    // Enhanced error handling
    const errorResponse = {
      success: false,
      message: 'AI diagnosis failed.',
      error: err.message,
      timestamp: new Date().toISOString()
    };

    // Specific error status codes
    if (err.message?.includes('API key')) {
      return res.status(500).json({
        ...errorResponse,
        message: 'AI service configuration error. Please check the API key.'
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        ...errorResponse,
        message: 'Invalid data format'
      });
    }

    if (err.message?.includes('Invalid response')) {
      return res.status(500).json({
        ...errorResponse,
        message: 'AI model returned an invalid response'
      });
    }

    // Generic server error
    return res.status(500).json({
      ...errorResponse,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
}; 