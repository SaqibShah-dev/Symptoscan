"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  Video, 
  Stethoscope, 
  Plus, 
  Filter,
  Search,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchTerm, setSearchTerm] = useState("")

  const appointments = {
    upcoming: [
      {
        id: 1,
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        date: "2024-01-15",
        time: "10:00 AM",
        type: "Video Consultation",
        status: "confirmed",
        location: "Telehealth",
        duration: "30 min",
        fee: 150,
        notes: "Regular follow-up for hypertension management"
      },
      {
        id: 2,
        doctor: "Dr. Michael Chen",
        specialty: "General Practitioner",
        date: "2024-01-18",
        time: "2:30 PM",
        type: "In-person",
        status: "confirmed",
        location: "123 Medical Center, New York, NY",
        duration: "45 min",
        fee: 120,
        notes: "Annual physical examination"
      },
      {
        id: 3,
        doctor: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        date: "2024-01-22",
        time: "4:00 PM",
        type: "Video Consultation",
        status: "pending",
        location: "Telehealth",
        duration: "30 min",
        fee: 180,
        notes: "Skin condition follow-up"
      }
    ],
    completed: [
      {
        id: 4,
        doctor: "Dr. David Kim",
        specialty: "Orthopedic Surgeon",
        date: "2024-01-10",
        time: "11:00 AM",
        type: "In-person",
        status: "completed",
        location: "456 Orthopedic Center, Chicago, IL",
        duration: "60 min",
        fee: 200,
        notes: "Knee pain consultation"
      },
      {
        id: 5,
        doctor: "Dr. Lisa Thompson",
        specialty: "Pediatrician",
        date: "2024-01-05",
        time: "3:00 PM",
        type: "In-person",
        status: "completed",
        location: "789 Children's Hospital, Seattle, WA",
        duration: "30 min",
        fee: 140,
        notes: "Child's regular checkup"
      }
    ],
    cancelled: [
      {
        id: 6,
        doctor: "Dr. Robert Martinez",
        specialty: "Psychiatrist",
        date: "2024-01-08",
        time: "2:00 PM",
        type: "Video Consultation",
        status: "cancelled",
        location: "Telehealth",
        duration: "45 min",
        fee: 160,
        notes: "Cancelled by patient"
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredAppointments = (appointmentsList: any[]) => {
    return appointmentsList.filter(appointment =>
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your scheduled appointments</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.upcoming.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.completed.length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.cancelled.length}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments by doctor or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({appointments.upcoming.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({appointments.completed.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({appointments.cancelled.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments(appointments.upcoming).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/doctor-${appointment.id}.jpg`} />
                          <AvatarFallback>
                            {appointment.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          {appointment.type === "Video Consultation" ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <Stethoscope className="h-3 w-3" />
                          )}
                          <span>{appointment.type}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{appointment.location}</span>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          ${appointment.fee}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Appointments</CardTitle>
                <CardDescription>Your past appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments(appointments.completed).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/doctor-${appointment.id}.jpg`} />
                          <AvatarFallback>
                            {appointment.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          {appointment.type === "Video Consultation" ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <Stethoscope className="h-3 w-3" />
                          )}
                          <span>{appointment.type}</span>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          ${appointment.fee}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Appointments</CardTitle>
                <CardDescription>Your cancelled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments(appointments.cancelled).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/doctor-${appointment.id}.jpg`} />
                          <AvatarFallback>
                            {appointment.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          {appointment.type === "Video Consultation" ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <Stethoscope className="h-3 w-3" />
                          )}
                          <span>{appointment.type}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Book Again
                          </Button>
                        </div>
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