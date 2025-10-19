"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  Phone, 
  Calendar,
  DollarSign,
  Heart,
  Stethoscope,
  Award,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DoctorProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const doctor = {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 156,
    experience: "15 years",
    education: "Harvard Medical School",
    location: "New York, NY",
    consultationFee: 150,
    availableToday: true,
    nextAvailable: "Today, 2:00 PM",
    acceptsInsurance: true,
    telehealthAvailable: true,
    languages: ["English", "Spanish"],
    about: "Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She is passionate about preventive cardiology and patient education.",
    image: "/doctor-1.jpg",
    credentials: [
      { degree: "MD", institution: "Harvard Medical School", year: "2009" },
      { degree: "Residency", institution: "Massachusetts General Hospital", year: "2013" },
      { degree: "Fellowship", institution: "Johns Hopkins Hospital", year: "2015" }
    ],
    specializations: [
      "Preventive Cardiology",
      "Heart Failure Management",
      "Cardiac Rehabilitation",
      "Hypertension Treatment",
      "Cholesterol Management"
    ],
    services: [
      { name: "Cardiac Consultation", duration: "30 min", price: 150 },
      { name: "ECG/EKG", duration: "15 min", price: 75 },
      { name: "Stress Test", duration: "45 min", price: 200 },
      { name: "Echocardiogram", duration: "30 min", price: 250 },
      { name: "Cardiac Rehabilitation", duration: "60 min", price: 100 }
    ],
    availability: {
      monday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      tuesday: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      wednesday: ["10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"],
      thursday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      friday: ["9:00 AM", "11:00 AM", "2:00 PM"],
      saturday: [],
      sunday: []
    },
    reviews: [
      {
        id: 1,
        patient: "John Smith",
        rating: 5,
        date: "2024-01-10",
        comment: "Dr. Johnson is an excellent cardiologist. She took the time to explain everything thoroughly and made me feel comfortable throughout the consultation.",
        verified: true
      },
      {
        id: 2,
        patient: "Emily Davis",
        rating: 5,
        date: "2024-01-05",
        comment: "Very professional and caring. Dr. Johnson helped me understand my heart condition and created a comprehensive treatment plan.",
        verified: true
      },
      {
        id: 3,
        patient: "Michael Brown",
        rating: 4,
        date: "2023-12-20",
        comment: "Good experience overall. The doctor was knowledgeable and the staff was friendly. Would recommend.",
        verified: true
      }
    ]
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={doctor.image} />
              <AvatarFallback className="text-xl">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-xl text-gray-600">{doctor.specialty}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  {renderStars(doctor.rating)}
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-sm text-gray-500">({doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Stethoscope className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{doctor.experience}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:ml-auto space-y-3 lg:w-80">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800">Next Available</p>
              <p className="text-lg font-semibold text-blue-600">{doctor.nextAvailable}</p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
              {doctor.telehealthAvailable && (
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Video Consultation
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{doctor.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="font-medium">${doctor.consultationFee}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Education</p>
                  <p className="font-medium">{doctor.education}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Languages</p>
                  <p className="font-medium">{doctor.languages.join(", ")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{doctor.about}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctor.specializations.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{spec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
                <CardDescription>Available services and their costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">Duration: {service.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">${service.price}</p>
                        <Button size="sm" className="mt-2">Book Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Availability</CardTitle>
                <CardDescription>Doctor's available time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(doctor.availability).map(([day, slots]) => (
                    <div key={day} className="p-4 border rounded-lg">
                      <p className="font-medium capitalize">{day}</p>
                      <div className="mt-2 space-y-1">
                        {slots.length > 0 ? (
                          slots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{slot}</span>
                              <Button size="sm" variant="outline">Book</Button>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <XCircle className="h-3 w-3" />
                            <span>Not available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
                <CardDescription>
                  {doctor.reviews.length} reviews • {doctor.rating} average rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.patient}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education & Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.credentials.map((cred, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">{cred.degree}</p>
                        <p className="text-sm text-gray-600">{cred.institution}</p>
                        <p className="text-sm text-gray-500">{cred.year}</p>
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