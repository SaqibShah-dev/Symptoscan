import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { FaRobot, FaStethoscope, FaUserMd, FaClock, FaExclamationTriangle, FaPlus, FaMinus } from 'react-icons/fa'
import api from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const SymptomChecker = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    symptoms: [''],
    duration: '',
    severity: '',
    age: '',
    gender: '',
  })
  const [analysis, setAnalysis] = useState(null)
  const [triage, setTriage] = useState(null)
  const [recommendations, setRecommendations] = useState(null)

  const symptomCheckerMutation = useMutation(
    (data) => api.post('/ai/symptom-checker', data),
    {
      onSuccess: (response) => {
        setAnalysis(response.data.analysis)
        setStep(2)
        toast.success('Symptom analysis completed!')
      },
      onError: (error) => {
        toast.error('Failed to analyze symptoms. Please try again.')
      },
    }
  )

  const triageMutation = useMutation(
    (data) => api.post('/ai/triage', data),
    {
      onSuccess: (response) => {
        setTriage(response.data.triage)
        setStep(3)
      },
      onError: (error) => {
        toast.error('Failed to perform triage assessment.')
      },
    }
  )

  const doctorRecommendationMutation = useMutation(
    (data) => api.post('/ai/doctor-recommendation', data),
    {
      onSuccess: (response) => {
        setRecommendations(response.data.recommendation)
        setStep(4)
      },
      onError: (error) => {
        toast.error('Failed to get doctor recommendations.')
      },
    }
  )

  const handleSymptomChange = (index, value) => {
    const newSymptoms = [...formData.symptoms]
    newSymptoms[index] = value
    setFormData({ ...formData, symptoms: newSymptoms })
  }

  const addSymptom = () => {
    setFormData({ ...formData, symptoms: [...formData.symptoms, ''] })
  }

  const removeSymptom = (index) => {
    if (formData.symptoms.length > 1) {
      const newSymptoms = formData.symptoms.filter((_, i) => i !== index)
      setFormData({ ...formData, symptoms: newSymptoms })
    }
  }

  const handleAnalyze = () => {
    const data = {
      symptoms: formData.symptoms.filter(s => s.trim() !== ''),
      duration: formData.duration,
      severity: formData.severity,
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender,
    }
    symptomCheckerMutation.mutate(data)
  }

  const handleTriage = () => {
    const data = {
      symptoms: formData.symptoms.filter(s => s.trim() !== ''),
      vitalSigns: {
        temperature: 'normal',
        bloodPressure: 'normal',
        heartRate: 'normal',
      },
    }
    triageMutation.mutate(data)
  }

  const handleGetRecommendations = () => {
    const data = {
      symptoms: formData.symptoms.filter(s => s.trim() !== ''),
      specialty: analysis?.possibleConditions?.[0]?.name,
    }
    doctorRecommendationMutation.mutate(data)
  }

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTriageColor = (level) => {
    switch (level) {
      case 1:
        return 'bg-red-100 text-red-800 border-red-200'
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 3:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 4:
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 5:
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Symptom Checker</h1>
        <p className="text-gray-600">Get intelligent health insights and recommendations</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      s <= step
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                {step === 1 && 'Enter Symptoms'}
                {step === 2 && 'Analysis Results'}
                {step === 3 && 'Triage Assessment'}
                {step === 4 && 'Doctor Recommendations'}
              </div>
            </div>
            <FaRobot className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What symptoms are you experiencing? *
                </label>
                {formData.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter symptom..."
                      value={symptom}
                      onChange={(e) => handleSymptomChange(index, e.target.value)}
                    />
                    {formData.symptoms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSymptom(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSymptom}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>Add Another Symptom</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How long have you had these symptoms?
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  >
                    <option value="">Select duration</option>
                    <option value="Less than a day">Less than a day</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="4-7 days">4-7 days</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="More than a month">More than a month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How severe are your symptoms?
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  >
                    <option value="">Select severity</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (optional)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    min="1"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender (optional)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={symptomCheckerMutation.isLoading || !formData.symptoms.some(s => s.trim() !== '')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {symptomCheckerMutation.isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Analyze Symptoms'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && analysis && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaStethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">AI Analysis Results</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      Based on your symptoms, here's what our AI system suggests:
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Possible Conditions</h3>
                <div className="space-y-3">
                  {analysis.possibleConditions.map((condition, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{condition.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          condition.probability === 'high' ? 'bg-red-100 text-red-800' :
                          condition.probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {condition.probability} probability
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Urgency Level</h3>
                  <div className={`p-4 rounded-lg border ${getUrgencyColor(analysis.urgencyLevel)}`}>
                    <div className="flex items-center space-x-2">
                      <FaExclamationTriangle className="w-5 h-5" />
                      <span className="font-medium capitalize">{analysis.urgencyLevel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                  <ul className="space-y-1">
                    {analysis.recommendedActions.map((action, index) => (
                      <li key={index} className="text-sm text-gray-600">• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Warning Signs</h3>
                <p className="text-sm text-yellow-800">
                  Seek immediate medical attention if you experience any of the following:
                </p>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                  {analysis.warningSigns.map((sign, index) => (
                    <li key={index}>• {sign}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Disclaimer:</strong> This AI-powered symptom checker is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleTriage}
                  disabled={triageMutation.isLoading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {triageMutation.isLoading ? <LoadingSpinner size="sm" /> : 'Get Triage Assessment'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && triage && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaClock className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-orange-900">Triage Assessment</h3>
                    <p className="text-sm text-orange-800 mt-1">
                      Professional medical priority assessment based on your symptoms:
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-lg border ${getTriageColor(triage.triageLevel)}`}>
                  <span className="text-2xl font-bold">Level {triage.triageLevel}</span>
                  <div>
                    <p className="font-medium capitalize">{triage.careSetting.replace('_', ' ')}</p>
                    <p className="text-sm">{triage.estimatedWaitTime.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Immediate Actions</h3>
                  <ul className="space-y-2">
                    {triage.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-gray-600">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Red Flags</h3>
                  <ul className="space-y-2">
                    {triage.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-gray-600">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                <p className="text-sm text-gray-600">{triage.recommendations}</p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGetRecommendations}
                  disabled={doctorRecommendationMutation.isLoading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {doctorRecommendationMutation.isLoading ? <LoadingSpinner size="sm" /> : 'Get Doctor Recommendations'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && recommendations && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaUserMd className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Doctor Recommendations</h3>
                    <p className="text-sm text-green-800 mt-1">
                      Based on your symptoms and triage assessment, here are our recommendations:
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recommended Specialty</h3>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="font-medium text-primary-900">{recommendations.recommendedSpecialty}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Top Recommended Doctors</h3>
                <div className="space-y-3">
                  {recommendations.recommendedDoctors.map((doctor, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Match: {doctor.matchScore}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${doctor.matchScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                      <p className="text-sm text-gray-600">{doctor.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">AI Reasoning</h3>
                <p className="text-sm text-gray-600">{recommendations.reasoning}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Alternative Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.alternativeSpecialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => window.location.href = '/doctors'}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse All Doctors
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SymptomChecker