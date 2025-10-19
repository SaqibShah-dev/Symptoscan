"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  Video, 
  Stethoscope, 
  MapPin, 
  DollarSign,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("video")
  const [reason, setReason] = useState("")
  const [symptoms, setSymptoms] = useState("")

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 156,
      experience: "15 years",
      consultationFee: 150,
      telehealthAvailable: true,
      image: "/doctor-1.jpg"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "General Practitioner",
      rating: 4.8,
      reviews: 203,
      experience: "12 years",
      consultationFee: 120,
      telehealthAvailable: true,
      image: "/doctor-2.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      rating: 4.7,
      reviews: 89,
      experience: "8 years",
      consultationFee: 180,
      telehealthAvailable: true,
      image: "/doctor-3.jpg"
    }
  ]

  const availableDates = [
    "2024-01-15",
    "2024-01-16",
    "2024-01-17",
    "2024-01-18",
    "2024-01-19",
    "2024-01-22",
    "2024-01-23"
  ]

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ]

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor)
    setStep(2)
  }

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setStep(3)
    }
  }

  const handleBookingSubmit = () => {
    // Here you would typically send the booking data to your backend
    console.log("Booking submitted:", {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      reason,
      symptoms
    })
    setStep(4)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
            <p className="text-gray-600 mt-1">Schedule your consultation</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 ${
                  step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Select Doctor</CardTitle>
                <CardDescription>Choose a healthcare provider for your appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={doctor.image} />
                          <AvatarFallback className="text-lg">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium">{doctor.rating}</span>
                              <span className="text-sm text-gray-500">({doctor.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <span>{doctor.experience}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{doctor.consultationFee}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {doctor.telehealthAvailable && (
                            <Badge variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              Telehealth
                            </Badge>
                          )}
                          <Badge variant="outline">Available</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && selectedDoctor && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Select Date & Time</CardTitle>
                  <CardDescription>Choose your preferred appointment slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Selected Doctor Info */}
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedDoctor.image} />
                        <AvatarFallback>
                          {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedDoctor.name}</h3>
                        <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                      </div>
                    </div>

                    {/* Appointment Type */}
                    <div>
                      <Label className="text-sm font-medium">Appointment Type</Label>
                      <RadioGroup
                        value={appointmentType}
                        onValueChange={setAppointmentType}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="video" />
                          <Label htmlFor="video" className="flex items-center space-x-2">
                            <Video className="h-4 w-4" />
                            <span>Video Consultation</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="in-person" id="in-person" />
                          <Label htmlFor="in-person" className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4" />
                            <span>In-Person</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <Label className="text-sm font-medium">Select Date</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {availableDates.map((date) => (
                          <Button
                            key={date}
                            variant={selectedDate === date ? "default" : "outline"}
                            className="h-auto p-3 flex flex-col"
                            onClick={() => setSelectedDate(date)}
                          >
                            <span className="text-sm font-medium">
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className="text-lg">
                              {new Date(date).getDate()}
                            </span>
                            <span className="text-xs">
                              {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <Label className="text-sm font-medium">Select Time</Label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleDateTimeSelect}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full"
                    >
                      Continue to Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Appointment Details</CardTitle>
                <CardDescription>Provide additional information for your appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Appointment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{selectedDoctor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Specialty:</span>
                        <span className="font-medium">{selectedDoctor.specialty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{appointmentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-medium text-green-600">${selectedDoctor.consultationFee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe the reason for your appointment..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <Label htmlFor="symptoms">Symptoms (Optional)</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe any symptoms you're experiencing..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleBookingSubmit} className="flex-1">
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Appointment Booked Successfully!</h2>
                    <p className="text-gray-600 mt-2">
                      Your appointment has been confirmed with {selectedDoctor.name}
                    </p>
                  </div>
                  
                  <div className="max-w-md mx-auto p-4 bg-blue-50 rounded-lg text-left">
                    <h3 className="font-semibold mb-2">Appointment Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{appointmentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{selectedDoctor.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 justify-center">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Book Another Appointment
                    </Button>
                    <Link href="/appointments">
                      <Button>View My Appointments</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}