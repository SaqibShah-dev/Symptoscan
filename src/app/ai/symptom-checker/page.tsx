"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Heart, 
  Brain, 
  Stethoscope, 
  Thermometer, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Calendar,
  MapPin,
  Phone,
  User
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function SymptomCheckerPage() {
  const [step, setStep] = useState(1)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const commonSymptoms = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Dizziness",
    "Chest Pain", "Shortness of Breath", "Abdominal Pain", "Joint Pain",
    "Skin Rash", "Sore Throat", "Runny Nose", "Muscle Aches", "Chills"
  ]

  const handleAddSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom])
    }
  }

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom))
  }

  const handleCustomSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms([...symptoms, newSymptom.trim()])
      setNewSymptom("")
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        possibleConditions: [
          { name: "Common Cold", probability: 75, urgency: "low", description: "Viral infection of the upper respiratory tract" },
          { name: "Influenza", probability: 45, urgency: "medium", description: "Contagious respiratory illness caused by influenza viruses" },
          { name: "COVID-19", probability: 30, urgency: "high", description: "Infectious disease caused by the SARS-CoV-2 virus" }
        ],
        recommendations: [
          "Rest and stay hydrated",
          "Monitor your symptoms closely",
          "Consider over-the-counter pain relievers",
          "Seek medical attention if symptoms worsen"
        ],
        urgencyLevel: "medium",
        nextSteps: [
          "Monitor symptoms for 24-48 hours",
          "Get plenty of rest",
          "Stay hydrated",
          "Contact your doctor if symptoms persist or worsen"
        ]
      })
      setIsAnalyzing(false)
      setStep(3)
    }, 3000)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600 bg-red-100"
      case "medium": return "text-yellow-600 bg-yellow-100"
      case "low": return "text-green-600 bg-green-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return <AlertTriangle className="h-4 w-4" />
      case "medium": return <Clock className="h-4 w-4" />
      case "low": return <CheckCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI Symptom Checker</h1>
          <p className="text-gray-600 mt-2">
            Get intelligent health insights based on your symptoms
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant="outline">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="outline">
              <Heart className="h-3 w-3 mr-1" />
              Confidential
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-600">
              {step === 1 ? "Symptoms" : step === 2 ? "Details" : "Results"}
            </span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {/* Disclaimer */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This AI symptom checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </AlertDescription>
        </Alert>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Step 1: Tell us about your symptoms
                </CardTitle>
                <CardDescription>
                  Select the symptoms you're experiencing from the list below, or add your own
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Common Symptoms */}
                <div>
                  <Label className="text-sm font-medium">Common Symptoms</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonSymptoms.map((symptom) => (
                      <Button
                        key={symptom}
                        variant={symptoms.includes(symptom) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAddSymptom(symptom)}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Symptom */}
                <div>
                  <Label className="text-sm font-medium">Add Custom Symptom</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      placeholder="Type a symptom..."
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomSymptom()}
                    />
                    <Button onClick={handleCustomSymptom} disabled={!newSymptom.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Selected Symptoms */}
                {symptoms.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Selected Symptoms</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {symptoms.map((symptom) => (
                        <Badge key={symptom} variant="secondary" className="flex items-center">
                          {symptom}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                            onClick={() => handleRemoveSymptom(symptom)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" disabled>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => setStep(2)} disabled={symptoms.length === 0}>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Step 2: Additional Information
                </CardTitle>
                <CardDescription>
                  Help us provide more accurate analysis with these details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label htmlFor="duration">How long have you had these symptoms?</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 days, 1 week, 3 months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                {/* Severity */}
                <div>
                  <Label>How severe are your symptoms?</Label>
                  <RadioGroup value={severity} onValueChange={setSeverity} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild" id="mild" />
                      <Label htmlFor="mild">Mild</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe" id="severe" />
                      <Label htmlFor="severe">Severe</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Information */}
                <div>
                  <Label htmlFor="additional">Additional Information (Optional)</Label>
                  <Textarea
                    id="additional"
                    placeholder="Any other relevant information about your symptoms or medical history..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Symptoms:</strong> {symptoms.join(", ")}</div>
                    {age && <div><strong>Age:</strong> {age}</div>}
                    {gender && <div><strong>Gender:</strong> {gender}</div>}
                    {duration && <div><strong>Duration:</strong> {duration}</div>}
                    {severity && <div><strong>Severity:</strong> {severity}</div>}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleAnalyze} disabled={!age || !gender || !duration || !severity}>
                    {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && analysis && (
            <div className="space-y-6">
              {/* Results Header */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    AI Analysis Results
                  </CardTitle>
                  <CardDescription>
                    Based on your symptoms and information provided
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Badge className={getUrgencyColor(analysis.urgencyLevel)}>
                      {getUrgencyIcon(analysis.urgencyLevel)}
                      <span className="ml-1 capitalize">{analysis.urgencyLevel} Priority</span>
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {analysis.urgencyLevel === "high" && "Consider seeking immediate medical attention"}
                      {analysis.urgencyLevel === "medium" && "Monitor symptoms and consult a healthcare provider"}
                      {analysis.urgencyLevel === "low" && "Symptoms appear mild, but monitor for changes"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Possible Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Possible Conditions</CardTitle>
                  <CardDescription>
                    AI-generated analysis based on your symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.possibleConditions.map((condition: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{condition.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getUrgencyColor(condition.urgency)}>
                              {getUrgencyIcon(condition.urgency)}
                              <span className="ml-1 capitalize">{condition.urgency}</span>
                            </Badge>
                            <Badge variant="outline">{condition.probability}% match</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{condition.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>
                    Suggested actions based on your symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>
                    What you should do now
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.nextSteps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Doctor
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Start New Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}