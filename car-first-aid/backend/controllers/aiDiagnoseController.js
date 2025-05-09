import { LMStudioService } from '../services/lmStudioService.js';
import { saveAiDiagnosis } from './diagnoseController.js';
import axios from 'axios';
import asyncHandler from 'express-async-handler';
import Diagnosis from '../models/diagnosis.js';

// LM Studio configuration
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';
const LM_STUDIO_MODEL = process.env.LM_STUDIO_MODEL || 'gemma-3-4b-it-qat';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

// Local knowledge base for fallback
const carDiagnosisKnowledge = {
  'STRANGE NOISES': {
    causes: [
      'Worn or loose belts',
      'Exhaust system issues',
      'Suspension problems',
      'Brake system wear',
      'Wheel bearing failure',
      'Engine component wear',
      'Transmission issues',
      'Power steering problems'
    ],
    severity: 'medium',
    solutions: [
      'Inspect belts and pulleys',
      'Check exhaust system for leaks',
      'Examine suspension components',
      'Inspect brake system',
      'Check wheel bearings',
      'Listen for specific noise location',
      'Check fluid levels'
    ],
    estimatedCost: '$100 - $500',
    safetyImplications: 'Medium - Should be addressed soon to prevent further damage'
  },
  'ENGINE WON\'T START': {
    causes: [
      'Dead battery',
      'Faulty starter motor',
      'Fuel system issues',
      'Ignition system problems',
      'Security system lockout',
      'Engine control module failure',
      'Fuel pump failure',
      'Timing belt/chain issues'
    ],
    severity: 'high',
    solutions: [
      'Check battery voltage and connections',
      'Inspect starter motor',
      'Verify fuel delivery',
      'Check ignition components',
      'Verify security system status',
      'Check for diagnostic trouble codes',
      'Inspect timing components'
    ],
    estimatedCost: '$200 - $1000',
    safetyImplications: 'High - Vehicle is not operational'
  },
  'CHECK ENGINE LIGHT': {
    causes: [
      'Oxygen sensor malfunction',
      'Catalytic converter issues',
      'Mass airflow sensor problems',
      'Spark plug/ignition coil issues',
      'Evaporative emissions system leak',
      'Throttle position sensor failure',
      'Engine misfire',
      'Fuel system problems'
    ],
    severity: 'medium',
    solutions: [
      'Read diagnostic trouble codes',
      'Inspect oxygen sensors',
      'Check catalytic converter',
      'Verify MAF sensor operation',
      'Inspect spark plugs and coils',
      'Check fuel system components',
      'Verify emissions system integrity'
    ],
    estimatedCost: '$100 - $800',
    safetyImplications: 'Medium - Should be diagnosed soon'
  },
  'BRAKE PROBLEMS': {
    causes: [
      'Worn brake pads/shoes',
      'Low brake fluid',
      'Brake system leak',
      'ABS system malfunction',
      'Brake caliper issues',
      'Brake master cylinder failure',
      'Brake booster problems',
      'Brake line damage'
    ],
    severity: 'high',
    solutions: [
      'Inspect brake pads and rotors',
      'Check brake fluid level',
      'Look for leaks in brake system',
      'Verify ABS system operation',
      'Inspect brake calipers',
      'Check master cylinder',
      'Test brake booster',
      'Inspect brake lines'
    ],
    estimatedCost: '$200 - $1000',
    safetyImplications: 'High - Critical safety system'
  },
  'BATTERY ISSUES': {
    causes: [
      'Old or failing battery',
      'Alternator problems',
      'Parasitic drain',
      'Loose or corroded connections',
      'Faulty battery cables',
      'Electrical system short',
      'Voltage regulator failure',
      'Starter motor issues'
    ],
    severity: 'medium',
    solutions: [
      'Test battery voltage',
      'Check alternator output',
      'Inspect for parasitic drain',
      'Clean and tighten connections',
      'Inspect battery cables',
      'Check for electrical shorts',
      'Test charging system',
      'Verify starter operation'
    ],
    estimatedCost: '$100 - $500',
    safetyImplications: 'Medium - Can leave you stranded'
  },
  'OVERHEATING': {
    causes: [
      'Low coolant level',
      'Faulty thermostat',
      'Radiator issues',
      'Water pump failure',
      'Cooling fan problems',
      'Head gasket failure',
      'Radiator cap issues',
      'Coolant leak'
    ],
    severity: 'high',
    solutions: [
      'Check coolant level',
      'Inspect thermostat',
      'Verify radiator operation',
      'Test water pump',
      'Check cooling fans',
      'Inspect for head gasket issues',
      'Verify radiator cap',
      'Look for coolant leaks'
    ],
    estimatedCost: '$200 - $1500',
    safetyImplications: 'High - Can cause severe engine damage'
  },
  'TRANSMISSION ISSUES': {
    causes: [
      'Low transmission fluid',
      'Worn clutch',
      'Transmission solenoid problems',
      'Torque converter issues',
      'Transmission control module failure',
      'Internal transmission damage',
      'Shift linkage problems',
      'Transmission mount failure'
    ],
    severity: 'high',
    solutions: [
      'Check transmission fluid level',
      'Inspect clutch components',
      'Test transmission solenoids',
      'Verify torque converter operation',
      'Check transmission control module',
      'Inspect for internal damage',
      'Verify shift linkage',
      'Check transmission mounts'
    ],
    estimatedCost: '$500 - $3000',
    safetyImplications: 'High - Can affect drivability'
  }
};

// Initialize LM Studio service
const lmStudioService = new LMStudioService();

// Enhanced local diagnosis generator
const generateLocalDiagnosis = (symptom, details, carDetails) => {
  const knowledge = carDiagnosisKnowledge[symptom] || {
    causes: [
      'Electrical system issue',
      'Sensor malfunction',
      'Mechanical component failure',
      'Regular maintenance needed'
    ],
    severity: 'medium',
    solutions: [
      'Check basic components',
      'Use OBD scanner for error codes',
      `Visit authorized ${carDetails.make} service center`,
      'Consider immediate inspection if safety-critical'
    ],
    estimatedCost: '$100 - $500',
    safetyImplications: 'Medium - Should be inspected soon'
  };

  // Analyze details for additional context
  const detailAnalysis = analyzeDetails(details, symptom);
  
  return {
    problem: symptom,
    causes: [...knowledge.causes, ...detailAnalysis.additionalCauses],
    severity: knowledge.severity,
    solutions: [...knowledge.solutions, ...detailAnalysis.additionalSolutions],
    estimatedCost: knowledge.estimatedCost,
    safetyImplications: knowledge.safetyImplications,
    detailAnalysis: detailAnalysis.analysis,
    carDetails: {
      make: carDetails.make,
      model: carDetails.model,
      year: carDetails.year
    }
  };
};

// Enhanced detail analysis
const analyzeDetails = (details, symptom) => {
  const analysis = {
    additionalCauses: [],
    additionalSolutions: [],
    analysis: []
  };

  // Convert details to lowercase for easier matching
  const lowerDetails = details.toLowerCase();

  // Analyze based on symptom type
  switch (symptom) {
    case 'STRANGE NOISES':
      if (lowerDetails.includes('squeak') || lowerDetails.includes('squeal')) {
        analysis.additionalCauses.push('Brake pad wear indicator');
        analysis.additionalSolutions.push('Inspect brake pads immediately');
      }
      if (lowerDetails.includes('grind') || lowerDetails.includes('grinding')) {
        analysis.additionalCauses.push('Severe brake pad wear');
        analysis.additionalSolutions.push('Replace brake pads urgently');
      }
      if (lowerDetails.includes('knock') || lowerDetails.includes('knocking')) {
        analysis.additionalCauses.push('Engine bearing issues');
        analysis.additionalSolutions.push('Check engine oil pressure');
      }
      break;

    case 'ENGINE WON\'T START':
      if (lowerDetails.includes('click') || lowerDetails.includes('clicking')) {
        analysis.additionalCauses.push('Weak battery or starter issues');
        analysis.additionalSolutions.push('Check battery voltage and starter');
      }
      if (lowerDetails.includes('crank') || lowerDetails.includes('cranking')) {
        analysis.additionalCauses.push('Fuel delivery or ignition problems');
        analysis.additionalSolutions.push('Check fuel pressure and spark');
      }
      break;

    case 'CHECK ENGINE LIGHT':
      if (lowerDetails.includes('blink') || lowerDetails.includes('blinking')) {
        analysis.additionalCauses.push('Severe engine misfire');
        analysis.additionalSolutions.push('Stop driving and check immediately');
      }
      break;

    case 'BRAKE PROBLEMS':
      if (lowerDetails.includes('spongy') || lowerDetails.includes('soft')) {
        analysis.additionalCauses.push('Air in brake lines');
        analysis.additionalSolutions.push('Bleed brake system');
      }
      if (lowerDetails.includes('pull') || lowerDetails.includes('pulling')) {
        analysis.additionalCauses.push('Uneven brake pad wear');
        analysis.additionalSolutions.push('Inspect brake calipers');
      }
      break;
  }

  // Add general analysis based on keywords
  if (lowerDetails.includes('sudden') || lowerDetails.includes('suddenly')) {
    analysis.analysis.push('Issue appears to have developed quickly');
  }
  if (lowerDetails.includes('gradual') || lowerDetails.includes('slowly')) {
    analysis.analysis.push('Issue has been developing over time');
  }
  if (lowerDetails.includes('worse') || lowerDetails.includes('worsening')) {
    analysis.analysis.push('Condition appears to be deteriorating');
  }

  return analysis;
};

// Helper function to sanitize diagnosis details
const sanitizeDiagnosisDetails = (details) => {
  if (Array.isArray(details)) {
    return details.join('. ');
  }
  return String(details || '');
};

// Helper function to handle diagnosis response
const handleDiagnosisResponse = async (req, res, diagnosis, isLocalFallback) => {
  try {
    if (!diagnosis) {
      console.error('No diagnosis data provided');
      return res.status(500).json({
        success: false,
        message: 'No diagnosis data available'
      });
    }

    // Ensure all required fields are present
    const formattedDiagnosis = {
      problem: diagnosis.problem || req.body.symptom,
      causes: Array.isArray(diagnosis.causes) ? diagnosis.causes : [],
      severity: diagnosis.severity || 'medium',
      solutions: Array.isArray(diagnosis.solutions) ? diagnosis.solutions : [],
      estimatedCost: diagnosis.estimatedCost || 'Unknown',
      safetyImplications: diagnosis.safetyImplications || 'Unknown',
      urgencyLevel: diagnosis.urgencyLevel || 3,
      additionalNotes: diagnosis.additionalNotes || '',
      detailAnalysis: Array.isArray(diagnosis.detailAnalysis) ? diagnosis.detailAnalysis : [],
      carDetails: diagnosis.carDetails || req.body.carDetails
    };

    // Prepare diagnosis data for saving
    const diagnosisData = {
      symptom: req.body.symptom,
      details: req.body.details || '',
      carDetails: req.body.carDetails,
      diagnosis: JSON.stringify(formattedDiagnosis),
      timestamp: new Date(),
      isLocalFallback: isLocalFallback
    };

    // Save diagnosis
    try {
      await saveAiDiagnosis(diagnosisData);
    } catch (saveError) {
      console.error('Error saving AI diagnosis:', saveError);
      // Continue even if save fails
    }

    // Return response
    return res.json({
      success: true,
      data: formattedDiagnosis
    });
  } catch (error) {
    console.error('Error in handleDiagnosisResponse:', error);
    return res.status(500).json({
      success: false,
      message: 'Error handling diagnosis response',
      error: error.message
    });
  }
};

// Main diagnosis function
export const generateAIDiagnosis = asyncHandler(async (req, res) => {
  try {
    const { symptom, details, carDetails } = req.body;

    // Validate required fields
    if (!symptom || !details || !carDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: symptom, details, or carDetails'
      });
    }

    if (!carDetails.make || !carDetails.model || !carDetails.year) {
      return res.status(400).json({
        success: false,
        message: 'Missing required car details: make, model, or year'
      });
    }

    console.log('Starting AI diagnosis process...');
    console.log('Input:', { symptom, details, carDetails });

    // Try to get AI diagnosis first
    let diagnosis = null;
    let isLocalFallback = false;

    try {
      // Create the prompt for LM Studio
      const prompt = `You are an expert automotive technician. Analyze this car problem and provide a detailed diagnosis in JSON format:

Problem: ${symptom}
Details: ${details}
Car: ${carDetails.make} ${carDetails.model} ${carDetails.year}

Required JSON format:
{
  "causes": ["list of specific possible causes"],
  "severity": "low/medium/high",
  "solutions": ["list of detailed step-by-step solutions"],
  "estimatedCost": "cost range in USD",
  "safetyImplications": "detailed safety impact description"
}

Provide a comprehensive diagnosis based on the specific car make, model, and year.`;

      console.log('Attempting to get AI diagnosis from LM Studio...');
      const aiResponse = await lmStudioService.generateDiagnosis(prompt);
      console.log('Raw AI Response:', aiResponse);

      if (aiResponse && typeof aiResponse === 'object') {
        // Validate the AI response structure
        if (Array.isArray(aiResponse.causes) && 
            Array.isArray(aiResponse.solutions) && 
            typeof aiResponse.severity === 'string') {
          
          diagnosis = {
            problem: symptom,
            causes: aiResponse.causes,
            severity: aiResponse.severity,
            solutions: aiResponse.solutions,
            estimatedCost: aiResponse.estimatedCost || 'Unknown',
            safetyImplications: aiResponse.safetyImplications || 'Unknown',
            carDetails: {
              make: carDetails.make,
              model: carDetails.model,
              year: carDetails.year
            },
            isAiGenerated: true
          };
          console.log('Successfully parsed AI diagnosis:', diagnosis);
        } else {
          console.error('Invalid AI response structure:', aiResponse);
          throw new Error('Invalid AI response structure');
        }
      } else {
        console.error('Invalid AI response:', aiResponse);
        throw new Error('Invalid AI response');
      }
    } catch (aiError) {
      console.error('Failed to get AI diagnosis:', aiError);
      isLocalFallback = true;
    }

    // Only use local diagnosis if AI diagnosis failed
    if (!diagnosis) {
      console.log('AI diagnosis failed, falling back to local diagnosis...');
      const localDiagnosis = generateLocalDiagnosis(symptom, details, carDetails);
      diagnosis = {
        ...localDiagnosis,
        isAiGenerated: false
      };
    }

    console.log('Final diagnosis:', diagnosis);

    // Save diagnosis if user is authenticated
    if (req.user) {
      try {
        const savedDiagnosis = await Diagnosis.create({
          user: req.user._id,
          symptom,
          details,
          carDetails,
          diagnosis: JSON.stringify(diagnosis),
          timestamp: new Date(),
          isAiGenerated: !isLocalFallback
        });
        console.log('Diagnosis saved successfully:', savedDiagnosis._id);
      } catch (saveError) {
        console.error('Error saving diagnosis:', saveError);
        // Continue even if save fails
      }
    }

    res.status(200).json({
      success: true,
      data: diagnosis
    });

  } catch (error) {
    console.error('AI Diagnosis error:', error);
    
    // Check if it's a connection error
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
      return res.status(503).json({
        success: false,
        message: 'LM Studio service is not running. Please start LM Studio and try again.',
        error: error.message
      });
    }

    // Check if it's a response parsing error
    if (error.message.includes('Invalid JSON format') || error.message.includes('Invalid response format')) {
      return res.status(500).json({
        success: false,
        message: 'Error processing AI response. Please try again.',
        error: error.message
      });
    }

    // Default error response
    res.status(500).json({
      success: false,
      message: 'Error generating AI diagnosis',
      error: error.message
    });
  }
});

// Validation helper
const validateRequest = (body) => {
  const { symptom, details, carDetails } = body;
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (!symptom) errors.push('Symptom is required');
  if (!details) errors.push('Details are required');
  if (!carDetails) {
    errors.push('Car details are required');
  } else {
    if (!carDetails.make) errors.push('Car make is required');
    if (!carDetails.model) errors.push('Car model is required');
    if (!carDetails.year) errors.push('Car year is required');
    
    // Validate year format and range (1900 to current year + 1)
    const year = parseInt(carDetails.year);
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      errors.push(`Car year must be between 1900 and ${currentYear + 1}`);
    }
  }

  return errors;
};

const aiDiagnose = asyncHandler(async (req, res) => {
  const { symptom, details, carDetails } = req.body;

  if (!symptom || !details) {
    res.status(400);
    throw new Error('Please provide symptom and details');
  }

  try {
    // Prepare the prompt for the AI model
    const prompt = `Car Problem Diagnosis:
Symptom: ${symptom}
Details: ${details}
Car Details: ${carDetails.make} ${carDetails.model} (${carDetails.year})

Please analyze this car problem and provide:
1. Severity level (low, medium, high)
2. Possible causes
3. Recommended solutions`;

    // Make request to Hugging Face API
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the AI response
    const aiResponse = response.data[0].generated_text;
    const severity = aiResponse.toLowerCase().includes('high') ? 'high' : 
                    aiResponse.toLowerCase().includes('medium') ? 'medium' : 'low';
    
    const causes = aiResponse.split('\n')
      .filter(line => line.toLowerCase().includes('cause'))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
    
    const solutions = aiResponse.split('\n')
      .filter(line => line.toLowerCase().includes('solution'))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    // Create and save the diagnosis
    const diagnosis = await Diagnosis.create({
      user: req.user._id,
      symptom,
      details,
      severity,
      causes,
      solutions,
      carDetails
    });

    res.status(200).json({
      success: true,
      data: {
        problem: symptom,
        severity,
        causes,
        solutions,
        diagnosisId: diagnosis._id
      }
    });

  } catch (error) {
    console.error('AI Diagnosis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing AI diagnosis'
    });
  }
});

export { aiDiagnose }; 