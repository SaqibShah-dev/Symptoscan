// const express = require('express');
// const { body, validationResult } = require('express-validator');
// // const ZAI = require('z-ai-web-dev-sdk');
// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });sxd
// const Patient = require('../models/Patient');
// const Doctor = require('../models/Doctor');
// const { auth } = require('../middleware/auth');

// const router = express.Router();

// router.post('/symptom-checker', auth, [
//   body('symptoms').isArray(),
//   body('symptoms.*').notEmpty(),
//   body('duration').optional().isString(),
//   body('severity').optional().isIn(['mild', 'moderate', 'severe']),
//   body('age').optional().isInt({ min: 0, max: 120 }),
//   body('gender').optional().isIn(['male', 'female', 'other'])
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { symptoms, duration, severity, age, gender } = req.body;
    
//     let patientProfile = {};
//     if (req.user.role === 'patient') {
//       const patient = await Patient.findOne({ user: req.user._id }).populate('user');
//       if (patient) {
//         patientProfile = {
//           age: patient.user.profile.dateOfBirth ? 
//             Math.floor((new Date() - new Date(patient.user.profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
//           gender: patient.user.profile.gender,
//           medicalHistory: patient.medicalHistory,
//           allergies: patient.allergies,
//           medications: patient.medications
//         };
//       }
//     }

//     // const zai = await ZAI.create();
//     const zai = openai;

    
//     const prompt = `
//     You are an AI medical assistant for a telemedicine platform. Please analyze the following symptoms and provide a preliminary assessment.

//     Patient Information:
//     - Age: ${age || patientProfile.age || 'Not provided'}
//     - Gender: ${gender || patientProfile.gender || 'Not provided'}
//     - Symptoms: ${symptoms.join(', ')}
//     - Duration: ${duration || 'Not provided'}
//     - Severity: ${severity || 'Not provided'}

//     Medical History (if available):
//     - Previous conditions: ${patientProfile.medicalHistory ? patientProfile.medicalHistory.map(h => h.condition).join(', ') : 'None'}
//     - Allergies: ${patientProfile.allergies ? patientProfile.allergies.join(', ') : 'None'}
//     - Current medications: ${patientProfile.medications ? patientProfile.medications.map(m => m.name).join(', ') : 'None'}

//     Please provide:
//     1. Possible conditions (list 3-5 most likely)
//     2. Urgency level (low, medium, high, emergency)
//     3. Recommended next steps
//     4. When to seek immediate medical attention
//     5. Lifestyle recommendations

//     Format your response as JSON with the following structure:
//     {
//       "possibleConditions": [
//         {
//           "name": "Condition name",
//           "probability": "high/medium/low",
//           "description": "Brief description"
//         }
//       ],
//       "urgencyLevel": "low/medium/high/emergency",
//       "recommendedActions": [
//         "Action 1",
//         "Action 2"
//       ],
//       "warningSigns": [
//         "Warning sign 1",
//         "Warning sign 2"
//       ],
//       "lifestyleRecommendations": [
//         "Recommendation 1",
//         "Recommendation 2"
//       ],
//       "recommendedSpecialists": [
//         "Specialist type 1",
//         "Specialist type 2"
//       ]
//     }
//     `;

//     const completion = await zai.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an AI medical assistant providing preliminary symptom analysis. Always include a disclaimer that this is not a substitute for professional medical advice.'
//         },
//         {
//           role: 'user',
//           content: prompt
//         }
//       ],
//       temperature: 0.3,
//       max_tokens: 1000
//     });

//     let analysis;
//     try {
//       analysis = JSON.parse(completion.choices[0].message.content);
//     } catch (parseError) {
//       analysis = {
//         possibleConditions: [],
//         urgencyLevel: 'medium',
//         recommendedActions: ['Consult with a healthcare professional'],
//         warningSigns: ['Seek immediate medical attention if symptoms worsen'],
//         lifestyleRecommendations: ['Rest and stay hydrated'],
//         recommendedSpecialists: ['General Practitioner']
//       };
//     }

//     res.json({
//       analysis,
//       disclaimer: 'This AI-powered symptom checker is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.',
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('AI Symptom Checker Error:', error);
//     res.status(500).json({ 
//       error: 'Failed to analyze symptoms',
//       fallback: {
//         possibleConditions: [],
//         urgencyLevel: 'medium',
//         recommendedActions: ['Please consult with a healthcare professional'],
//         warningSigns: ['Seek immediate medical attention for severe symptoms'],
//         lifestyleRecommendations: ['Monitor your symptoms and rest'],
//         recommendedSpecialists: ['General Practitioner']
//       }
//     });
//   }
// });

// router.post('/triage', auth, [
//   body('symptoms').isArray(),
//   body('symptoms.*').notEmpty(),
//   body('vitalSigns').optional().isObject(),
//   body('medicalHistory').optional().isArray()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { symptoms, vitalSigns, medicalHistory } = req.body;

//     const zai = await ZAI.create();
    
//     const prompt = `
//     You are an AI triage assistant for emergency medical assessment. Please analyze the following information and provide triage recommendations.

//     Symptoms: ${symptoms.join(', ')}
    
//     Vital Signs (if available):
//     ${vitalSigns ? JSON.stringify(vitalSigns, null, 2) : 'Not provided'}
    
//     Medical History (if available):
//     ${medicalHistory ? medicalHistory.join(', ') : 'None'}

//     Please provide:
//     1. Triage level (1-5, where 1 is most urgent)
//     2. Recommended care setting (home care, urgent care, emergency room)
//     3. Estimated wait time recommendation
//     4. Immediate actions to take
//     5. Red flags that require immediate emergency care

//     Format your response as JSON:
//     {
//       "triageLevel": 1,
//       "careSetting": "emergency_room/urgent_care/home_care",
//       "estimatedWaitTime": "immediate/within_1_hour/within_24_hours/consult_doctor",
//       "immediateActions": [
//         "Action 1",
//         "Action 2"
//       ],
//       "redFlags": [
//         "Red flag 1",
//         "Red flag 2"
//       ],
//       "recommendations": "Detailed recommendations"
//     }
//     `;

//     const completion = await zai.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an AI triage assistant providing emergency medical assessment. Always prioritize patient safety and recommend emergency care when in doubt.'
//         },
//         {
//           role: 'user',
//           content: prompt
//         }
//       ],
//       temperature: 0.2,
//       max_tokens: 800
//     });

//     let triage;
//     try {
//       triage = JSON.parse(completion.choices[0].message.content);
//     } catch (parseError) {
//       triage = {
//         triageLevel: 3,
//         careSetting: 'home_care',
//         estimatedWaitTime: 'consult_doctor',
//         immediateActions: ['Monitor symptoms', 'Contact healthcare provider if symptoms worsen'],
//         redFlags: ['Difficulty breathing', 'Chest pain', 'Severe bleeding'],
//         recommendations: 'Please consult with a healthcare professional for proper evaluation.'
//       };
//     }

//     res.json({
//       triage,
//       disclaimer: 'This AI triage system is for informational purposes only. In case of emergency, call emergency services immediately or go to the nearest emergency room.',
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('AI Triage Error:', error);
//     res.status(500).json({ 
//       error: 'Failed to perform triage assessment',
//       fallback: {
//         triageLevel: 3,
//         careSetting: 'home_care',
//         estimatedWaitTime: 'consult_doctor',
//         immediateActions: ['Monitor your symptoms', 'Contact healthcare provider'],
//         redFlags: ['Seek immediate care for severe symptoms'],
//         recommendations: 'Please consult with a healthcare professional for proper evaluation.'
//       }
//     });
//   }
// });

// router.post('/doctor-recommendation', auth, [
//   body('symptoms').isArray(),
//   body('symptoms.*').notEmpty(),
//   body('specialty').optional().isString(),
//   body('location').optional().isString()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { symptoms, specialty, location } = req.body;

//     let query = { isVerified: true };
    
//     if (specialty) {
//       query.specialization = { $regex: specialty, $options: 'i' };
//     }

//     const doctors = await Doctor.find(query)
//       .populate('user', 'profile.firstName profile.lastName profile.profileImage')
//       .sort({ rating: -1, totalReviews: -1 })
//       .limit(10);

//     const zai = await ZAI.create();
    
//     const prompt = `
//     Based on the following symptoms, recommend the most appropriate type of doctor or specialist:

//     Symptoms: ${symptoms.join(', ')}
//     Preferred specialty: ${specialty || 'Any'}
//     Location: ${location || 'Not specified'}

//     Available doctor types from our system:
//     ${doctors.map(d => `- ${d.specialization} (Dr. ${d.user.profile.firstName} ${d.user.profile.lastName})`).join('\n')}

//     Please provide:
//     1. Recommended specialty type
//     2. Top 3 doctor recommendations from the available list
//     3. Reason for recommendations
//     4. Alternative specialties if primary recommendation is not available

//     Format your response as JSON:
//     {
//       "recommendedSpecialty": "Specialty name",
//       "recommendedDoctors": [
//         {
//           "doctorId": "doctor_id",
//           "name": "Doctor name",
//           "specialty": "Specialty",
//           "reason": "Why this doctor is recommended",
//           "matchScore": 95
//         }
//       ],
//       "reasoning": "Detailed reasoning for recommendations",
//       "alternativeSpecialties": ["Alternative 1", "Alternative 2"]
//     }
//     `;

//     const completion = await zai.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an AI medical referral assistant providing doctor recommendations based on symptoms and patient needs.'
//         },
//         {
//           role: 'user',
//           content: prompt
//         }
//       ],
//       temperature: 0.4,
//       max_tokens: 1000
//     });

//     let recommendation;
//     try {
//       recommendation = JSON.parse(completion.choices[0].message.content);
//     } catch (parseError) {
//       recommendation = {
//         recommendedSpecialty: specialty || 'General Practitioner',
//         recommendedDoctors: doctors.slice(0, 3).map((doc, index) => ({
//           doctorId: doc._id,
//           name: `Dr. ${doc.user.profile.firstName} ${doc.user.profile.lastName}`,
//           specialty: doc.specialization,
//           reason: 'Available and highly rated',
//           matchScore: 90 - (index * 10)
//         })),
//         reasoning: 'Based on your symptoms and available doctors',
//         alternativeSpecialties: ['General Practitioner', 'Internal Medicine']
//       };
//     }

//     res.json({
//       recommendation,
//       availableDoctors: doctors,
//       disclaimer: 'AI recommendations are for informational purposes. Please research doctors and choose based on your specific needs and preferences.',
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('AI Doctor Recommendation Error:', error);
//     res.status(500).json({ 
//       error: 'Failed to generate doctor recommendations',
//       fallback: {
//         recommendedSpecialty: 'General Practitioner',
//         recommendedDoctors: [],
//         reasoning: 'Please browse available doctors and choose based on your needs',
//         alternativeSpecialties: ['General Practitioner', 'Internal Medicine']
//       }
//     });
//   }
// });

// module.exports = router;


































const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { auth } = require('../middleware/auth');

const router = express.Router();

/* ------------------- SYMPTOM CHECKER ------------------- */
router.post('/symptom-checker', auth, [
  body('symptoms').isArray(),
  body('symptoms.*').notEmpty(),
  body('duration').optional().isString(),
  body('severity').optional().isIn(['mild', 'moderate', 'severe']),
  body('age').optional().isInt({ min: 0, max: 120 }),
  body('gender').optional().isIn(['male', 'female', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { symptoms, duration, severity, age, gender } = req.body;
    let patientProfile = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id }).populate('user');
      if (patient) {
        patientProfile = {
          age: patient.user.profile.dateOfBirth
            ? Math.floor((new Date() - new Date(patient.user.profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
            : null,
          gender: patient.user.profile.gender,
          medicalHistory: patient.medicalHistory,
          allergies: patient.allergies,
          medications: patient.medications
        };
      }
    }

    const ai = openai;

    const prompt = `
    You are an AI medical assistant for a telemedicine platform. Please analyze the following symptoms and provide a preliminary assessment.

    Patient Information:
    - Age: ${age || patientProfile.age || 'Not provided'}
    - Gender: ${gender || patientProfile.gender || 'Not provided'}
    - Symptoms: ${symptoms.join(', ')}
    - Duration: ${duration || 'Not provided'}
    - Severity: ${severity || 'Not provided'}

    Medical History (if available):
    - Previous conditions: ${patientProfile.medicalHistory ? patientProfile.medicalHistory.map(h => h.condition).join(', ') : 'None'}
    - Allergies: ${patientProfile.allergies ? patientProfile.allergies.join(', ') : 'None'}
    - Current medications: ${patientProfile.medications ? patientProfile.medications.map(m => m.name).join(', ') : 'None'}

    Please provide:
    1. Possible conditions (list 3-5 most likely)
    2. Urgency level (low, medium, high, emergency)
    3. Recommended next steps
    4. When to seek immediate medical attention
    5. Lifestyle recommendations

    Format your response as JSON with the following structure:
    {
      "possibleConditions": [
        { "name": "Condition name", "probability": "high/medium/low", "description": "Brief description" }
      ],
      "urgencyLevel": "low/medium/high/emergency",
      "recommendedActions": ["Action 1", "Action 2"],
      "warningSigns": ["Warning 1", "Warning 2"],
      "lifestyleRecommendations": ["Recommendation 1", "Recommendation 2"],
      "recommendedSpecialists": ["Specialist 1", "Specialist 2"]
    }`;

    const completion = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI medical assistant providing preliminary symptom analysis. Always include a disclaimer that this is not a substitute for professional medical advice.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    let analysis;
    try {
      analysis = JSON.parse(completion.choices[0].message.content);
    } catch {
      analysis = {
        possibleConditions: [],
        urgencyLevel: 'medium',
        recommendedActions: ['Consult with a healthcare professional'],
        warningSigns: ['Seek immediate medical attention if symptoms worsen'],
        lifestyleRecommendations: ['Rest and stay hydrated'],
        recommendedSpecialists: ['General Practitioner']
      };
    }

    res.json({
      analysis,
      disclaimer: 'This AI-powered symptom checker is not a substitute for professional medical advice, diagnosis, or treatment.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Symptom Checker Error:', error);
    res.status(500).json({
      error: 'Failed to analyze symptoms',
      fallback: {
        possibleConditions: [],
        urgencyLevel: 'medium',
        recommendedActions: ['Please consult a healthcare professional']
      }
    });
  }
});

/* ------------------- TRIAGE ------------------- */
router.post('/triage', auth, [
  body('symptoms').isArray(),
  body('symptoms.*').notEmpty(),
  body('vitalSigns').optional().isObject(),
  body('medicalHistory').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { symptoms, vitalSigns, medicalHistory } = req.body;
    const ai = openai;

    const prompt = `
    You are an AI triage assistant. Analyze the data and return triage recommendations.

    Symptoms: ${symptoms.join(', ')}
    Vital Signs: ${vitalSigns ? JSON.stringify(vitalSigns, null, 2) : 'Not provided'}
    Medical History: ${medicalHistory ? medicalHistory.join(', ') : 'None'}

    Format JSON:
    {
      "triageLevel": 1,
      "careSetting": "emergency_room/urgent_care/home_care",
      "estimatedWaitTime": "immediate/within_1_hour/within_24_hours",
      "immediateActions": ["Action 1", "Action 2"],
      "redFlags": ["Flag 1", "Flag 2"],
      "recommendations": "Summary"
    }`;

    const completion = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'AI triage assistant for emergency assessment.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    });

    let triage;
    try {
      triage = JSON.parse(completion.choices[0].message.content);
    } catch {
      triage = {
        triageLevel: 3,
        careSetting: 'home_care',
        estimatedWaitTime: 'consult_doctor',
        immediateActions: ['Monitor symptoms'],
        redFlags: ['Difficulty breathing'],
        recommendations: 'Consult healthcare provider.'
      };
    }

    res.json({
      triage,
      disclaimer: 'Informational only. Call emergency services in case of emergency.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Triage Error:', error);
    res.status(500).json({ error: 'Failed to perform triage assessment' });
  }
});

/* ------------------- DOCTOR RECOMMENDATION ------------------- */
router.post('/doctor-recommendation', auth, [
  body('symptoms').isArray(),
  body('symptoms.*').notEmpty(),
  body('specialty').optional().isString(),
  body('location').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { symptoms, specialty, location } = req.body;
    const query = { isVerified: true };
    if (specialty) query.specialization = { $regex: specialty, $options: 'i' };

    const doctors = await Doctor.find(query)
      .populate('user', 'profile.firstName profile.lastName profile.profileImage')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(10);

    const ai = openai;

    const prompt = `
    Based on these symptoms, suggest the best doctor type and top recommendations.

    Symptoms: ${symptoms.join(', ')}
    Preferred specialty: ${specialty || 'Any'}
    Location: ${location || 'Not specified'}
    Available doctors:
    ${doctors.map(d => `- ${d.specialization} (Dr. ${d.user.profile.firstName} ${d.user.profile.lastName})`).join('\n')}

    Format JSON:
    {
      "recommendedSpecialty": "Specialty",
      "recommendedDoctors": [
        { "doctorId": "id", "name": "Doctor", "specialty": "Spec", "reason": "Why", "matchScore": 90 }
      ],
      "reasoning": "Detailed reasoning",
      "alternativeSpecialties": ["Alt1", "Alt2"]
    }`;

    const completion = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'AI referral assistant recommending doctors.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1000
    });

    let recommendation;
    try {
      recommendation = JSON.parse(completion.choices[0].message.content);
    } catch {
      recommendation = {
        recommendedSpecialty: specialty || 'General Practitioner',
        recommendedDoctors: doctors.slice(0, 3).map((doc, index) => ({
          doctorId: doc._id,
          name: `Dr. ${doc.user.profile.firstName} ${doc.user.profile.lastName}`,
          specialty: doc.specialization,
          reason: 'Highly rated and available',
          matchScore: 90 - (index * 10)
        })),
        reasoning: 'Based on symptoms and available doctors',
        alternativeSpecialties: ['General Practitioner', 'Internal Medicine']
      };
    }

    res.json({
      recommendation,
      availableDoctors: doctors,
      disclaimer: 'AI recommendations are informational only.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Doctor Recommendation Error:', error);
    res.status(500).json({ error: 'Failed to generate doctor recommendations' });
  }
});

module.exports = router;
