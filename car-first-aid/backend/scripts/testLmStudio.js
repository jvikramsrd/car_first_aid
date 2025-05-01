import { LMStudioService } from '../services/lmStudioService.js';

const testDiagnosis = async () => {
  const lmStudioService = new LMStudioService();
  
  const testCases = [
    {
      symptom: 'CHECK ENGINE LIGHT',
      details: 'The check engine light came on suddenly while driving. No noticeable performance issues.',
      carDetails: {
        make: 'Toyota',
        model: 'Camry',
        year: '2020'
      }
    },
    {
      symptom: 'STRANGE NOISES',
      details: 'Hearing a grinding noise from the front left wheel when braking.',
      carDetails: {
        make: 'Honda',
        model: 'Civic',
        year: '2018'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log('\nTesting diagnosis for:', testCase.symptom);
    console.log('Car:', `${testCase.carDetails.year} ${testCase.carDetails.make} ${testCase.carDetails.model}`);
    console.log('Details:', testCase.details);

    try {
      const prompt = `As an expert automotive technician, analyze this car issue:

Car Details:
- Make: ${testCase.carDetails.make}
- Model: ${testCase.carDetails.model}
- Year: ${testCase.carDetails.year}

Problem:
- Symptom: ${testCase.symptom}
- Additional Details: ${testCase.details}

Please provide a detailed analysis including:
1. Most likely causes (list 3-5 specific causes)
2. Severity level (low/medium/high)
3. Required actions (step-by-step recommendations)
4. Estimated repair costs (range in USD)
5. Safety implications
6. Urgency level (1-5, where 5 is most urgent)

Format the response as a JSON object with these exact keys:
{
  "causes": ["array", "of", "causes"],
  "severity": "low/medium/high",
  "solutions": ["array", "of", "solutions"],
  "estimatedCost": "cost range",
  "safetyImplications": "detailed safety implications",
  "urgencyLevel": "number between 1-5",
  "additionalNotes": "any additional relevant information"
}`;

      const response = await lmStudioService.generateDiagnosis(prompt);
      console.log('\nLM Studio Response:');
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
};

// Run the test
testDiagnosis().catch(console.error); 