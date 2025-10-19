"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  Phone,
  Heart,
  Stethoscope,
  Calendar,
  DollarSign
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const specialties = [
    "All",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "General Practice",
    "Neurology",
    "Obstetrics & Gynecology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Urology"
  ]

  const doctors = [
    {
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
      about: "Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions.",
      image: "/doctor-1.jpg"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "General Practitioner",
      rating: 4.8,
      reviews: 203,
      experience: "12 years",
      education: "Johns Hopkins University",
      location: "Los Angeles, CA",
      consultationFee: 120,
      availableToday: false,
      nextAvailable: "Tomorrow, 9:00 AM",
      acceptsInsurance: true,
      telehealthAvailable: true,
      languages: ["English", "Mandarin"],
      about: "Dr. Chen provides comprehensive primary care with a focus on preventive medicine and chronic disease management.",
      image: "/doctor-2.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      rating: 4.7,
      reviews: 89,
      experience: "8 years",
      education: "Stanford University",
      location: "Miami, FL",
      consultationFee: 180,
      availableToday: true,
      nextAvailable: "Today, 4:30 PM",
      acceptsInsurance: true,
      telehealthAvailable: true,
      languages: ["English", "Spanish"],
      about: "Dr. Rodriguez specializes in medical and cosmetic dermatology, offering cutting-edge treatments for skin conditions.",
      image: "/doctor-3.jpg"
    },
    {
      id: 4,
      name: "Dr. David Kim",
      specialty: "Orthopedic Surgeon",
      rating: 4.9,
      reviews: 134,
      experience: "20 years",
      education: "Mayo Clinic",
      location: "Chicago, IL",
      consultationFee: 200,
      availableToday: false,
      nextAvailable: "Jan 18, 10:00 AM",
      acceptsInsurance: true,
      telehealthAvailable: false,
      languages: ["English", "Korean"],
      about: "Dr. Kim is an expert in joint replacement and sports medicine, helping patients regain mobility and quality of life.",
      image: "/doctor-4.jpg"
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialty: "Pediatrician",
      rating: 4.8,
      reviews: 178,
      experience: "10 years",
      education: "Boston Children's Hospital",
      location: "Seattle, WA",
      consultationFee: 140,
      availableToday: true,
      nextAvailable: "Today, 3:00 PM",
      acceptsInsurance: true,
      telehealthAvailable: true,
      languages: ["English"],
      about: "Dr. Thompson provides compassionate care for children from infancy through adolescence, focusing on preventive health.",
      image: "/doctor-5.jpg"
    },
    {
      id: 6,
      name: "Dr. Robert Martinez",
      specialty: "Psychiatrist",
      rating: 4.6,
      reviews: 92,
      experience: "14 years",
      education: "Yale University",
      location: "Austin, TX",
      consultationFee: 160,
      availableToday: false,
      nextAvailable: "Jan 19, 11:00 AM",
      acceptsInsurance: true,
      telehealthAvailable: true,
      languages: ["English", "Spanish"],
      about: "Dr. Martinez specializes in mental health treatment, offering therapy and medication management for various conditions.",
      image: "/doctor-6.jpg"
    }
  ]

  const filteredDoctors = doctors
    .filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === "all" || 
                             doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      return matchesSearch && matchesSpecialty
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "experience") return b.experience.split(' ')[0] - a.experience.split(' ')[0]
      if (sortBy === "price") return a.consultationFee - b.consultationFee
      return 0
    })

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
            <p className="text-gray-600 mt-1">Connect with qualified healthcare professionals</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by doctor name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Specialties:</span>
                {specialties.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={selectedSpecialty === specialty.toLowerCase() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty.toLowerCase())}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex space-x-2">
                  <Button
                    variant={sortBy === "rating" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("rating")}
                  >
                    Rating
                  </Button>
                  <Button
                    variant={sortBy === "experience" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("experience")}
                  >
                    Experience
                  </Button>
                  <Button
                    variant={sortBy === "price" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("price")}
                  >
                    Price
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredDoctors.length} doctors found
          </p>
        </div>

        {/* Doctors List */}
        <div className="space-y-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Doctor Info */}
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={doctor.image} />
                      <AvatarFallback className="text-lg">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                              <span className="text-sm text-gray-500">({doctor.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Stethoscope className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{doctor.experience}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{doctor.consultationFee}</span>
                          </div>
                          <p className="text-xs text-gray-500">consultation fee</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{doctor.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Heart className="h-4 w-4" />
                          <span>{doctor.education}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {doctor.availableToday && (
                          <Badge className="bg-green-100 text-green-800">
                            Available Today
                          </Badge>
                        )}
                        {doctor.telehealthAvailable && (
                          <Badge variant="outline">
                            <Video className="h-3 w-3 mr-1" />
                            Telehealth
                          </Badge>
                        )}
                        {doctor.acceptsInsurance && (
                          <Badge variant="outline">
                            Insurance Accepted
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 lg:w-64">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-blue-800">Next Available</p>
                      <p className="text-sm text-blue-600">{doctor.nextAvailable}</p>
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
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">{doctor.about}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Languages:</span>
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}