import { LMStudioService } from '../services/lmStudioService.js';
import { saveAiDiagnosis } from './diagnoseController.js';

// LM Studio configuration
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';
const LM_STUDIO_MODEL = process.env.LM_STUDIO_MODEL || 'local-model';

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

    const { symptom, details, carDetails } = req.body;
    
    console.log('Processing request for:', {
      symptom,
      details,
      carMake: carDetails.make,
      carModel: carDetails.model,
      carYear: carDetails.year
    });

    try {
      // Prepare the prompt for LM Studio
      const prompt = `As an expert automotive technician, analyze this car issue:

Car Details:
- Make: ${carDetails.make}
- Model: ${carDetails.model}
- Year: ${carDetails.year}

Problem:
- Symptom: ${symptom}
- Additional Details: ${details}

Please provide a detailed analysis including:
1. Most likely causes (list 3-5 specific causes)
2. Severity level (low/medium/high)
3. Required actions (step-by-step recommendations)
4. Estimated repair costs (range in USD)
5. Safety implications
6. Urgency level (1-5, where 5 is most urgent)

Format the response as a JSON object with these exact keys:
{
  "causes": ["array of specific causes"],
  "severity": "low/medium/high",
  "solutions": ["array of detailed step-by-step solutions"],
  "estimatedCost": "cost range in USD",
  "safetyImplications": "detailed safety implications",
  "urgencyLevel": number between 1-5,
  "additionalNotes": "any additional relevant information"
}`;

      // Call LM Studio service
      const aiResponse = await lmStudioService.generateDiagnosis(prompt);
      
      // Combine AI response with local analysis
      const detailAnalysis = analyzeDetails(details, symptom);
      
      const diagnosis = {
        problem: symptom,
        causes: [...aiResponse.causes, ...detailAnalysis.additionalCauses],
        severity: aiResponse.severity,
        solutions: [...aiResponse.solutions, ...detailAnalysis.additionalSolutions],
        estimatedCost: aiResponse.estimatedCost,
        safetyImplications: aiResponse.safetyImplications,
        urgencyLevel: aiResponse.urgencyLevel,
        additionalNotes: aiResponse.additionalNotes,
        detailAnalysis: detailAnalysis.analysis,
        carDetails: {
          make: carDetails.make,
          model: carDetails.model,
          year: carDetails.year
        }
      };

      return handleDiagnosisResponse(req, res, diagnosis, false);

    } catch (aiError) {
      console.error('AI diagnosis error:', aiError);
      console.log('Falling back to local diagnosis');
      
      // Use local diagnosis as fallback
      const localDiagnosis = generateLocalDiagnosis(symptom, details, carDetails);
      
      // Ensure the local diagnosis has all required fields
      const fallbackDiagnosis = {
        problem: symptom,
        causes: localDiagnosis.causes || [],
        severity: localDiagnosis.severity || 'medium',
        solutions: localDiagnosis.solutions || [],
        estimatedCost: localDiagnosis.estimatedCost || 'Unknown',
        safetyImplications: localDiagnosis.safetyImplications || 'Unknown',
        urgencyLevel: 3,
        additionalNotes: 'Generated using local fallback system',
        detailAnalysis: localDiagnosis.detailAnalysis || [],
        carDetails: localDiagnosis.carDetails || carDetails
      };

      return handleDiagnosisResponse(req, res, fallbackDiagnosis, true);
    }

  } catch (err) {
    console.error('Diagnosis error:', err);
    return res.status(500).json({
      success: false,
      message: 'Diagnosis failed',
      error: err.message
    });
  }
};

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