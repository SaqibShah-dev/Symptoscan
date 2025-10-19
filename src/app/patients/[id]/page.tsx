"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Heart, 
  Pill,
  Activity,
  Edit,
  Plus,
  Download,
  Share2
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function PatientProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const patient = {
    id: 1,
    name: "John Smith",
    age: 45,
    gender: "Male",
    bloodType: "O+",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1 (555) 123-4568"
    },
    medicalConditions: [
      { name: "Hypertension", diagnosed: "2020-03-15", severity: "Moderate" },
      { name: "Diabetes Type 2", diagnosed: "2019-08-22", severity: "Controlled" }
    ],
    allergies: ["Penicillin", "Shellfish"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribed: "2024-01-01" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribed: "2024-01-01" }
    ],
    appointments: [
      { date: "2024-01-10", doctor: "Dr. Sarah Johnson", type: "Follow-up", status: "completed" },
      { date: "2024-01-25", doctor: "Dr. Michael Chen", type: "Regular Checkup", status: "scheduled" },
      { date: "2024-02-15", doctor: "Dr. Sarah Johnson", type: "Follow-up", status: "scheduled" }
    ],
    medicalRecords: [
      { date: "2024-01-10", type: "Blood Test", doctor: "Dr. Sarah Johnson", status: "completed" },
      { date: "2023-12-20", type: "X-Ray", doctor: "Dr. Michael Chen", status: "completed" },
      { date: "2023-11-15", type: "ECG", doctor: "Dr. Sarah Johnson", status: "completed" }
    ],
    vitals: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "175 lbs",
      height: "5'10\"",
      bmi: "25.1"
    }
  }

  return (
    <DashboardLayout userRole="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`/patient-${patient.id}.jpg`} />
              <AvatarFallback className="text-lg">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">{patient.age} years old, {patient.gender}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">Blood Type: {patient.bloodType}</Badge>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.address}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-800">Emergency Contact</p>
              <p className="text-sm text-red-600">
                {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
              </p>
              <p className="text-sm text-red-600">{patient.emergencyContact.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Current Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-semibold text-blue-800">{patient.vitals.bloodPressure}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-lg font-semibold text-red-800">{patient.vitals.heartRate}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-lg font-semibold text-green-800">{patient.vitals.temperature}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-semibold text-purple-800">{patient.vitals.weight}</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="text-lg font-semibold text-yellow-800">{patient.vitals.height}</p>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-600">BMI</p>
                    <p className="text-lg font-semibold text-indigo-800">{patient.vitals.bmi}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Pill className="mr-2 h-5 w-5" />
                    Current Medications
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.medications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-gray-600">
                          {medication.dosage} - {medication.frequency}
                        </p>
                        <p className="text-xs text-gray-500">Prescribed: {medication.prescribed}</p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            {/* Medical Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" />
                    Medical Conditions
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Condition
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.medicalConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{condition.name}</p>
                        <p className="text-sm text-gray-600">
                          Diagnosed: {condition.diagnosed} | Severity: {condition.severity}
                        </p>
                      </div>
                      <Badge variant="outline">{condition.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" />
                    Allergies
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Allergy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">{allergy}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Appointments
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{appointment.date}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.doctor} - {appointment.type}
                        </p>
                      </div>
                      <Badge 
                        variant={appointment.status === "completed" ? "default" : "secondary"}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Medical Records
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.medicalRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-gray-600">
                          {record.date} - {record.doctor}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{record.status}</Badge>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}