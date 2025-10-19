"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Users,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MonitorOff,
  MoreHorizontal,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function ConsultationsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const consultations = {
    upcoming: [
      {
        id: 1,
        patient: "John Smith",
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        date: "2024-01-15",
        time: "10:00 AM",
        type: "Video Consultation",
        status: "scheduled",
        duration: "30 min",
        reason: "Follow-up for hypertension",
        joinUrl: "/consultations/room/1"
      },
      {
        id: 2,
        patient: "Emily Davis",
        doctor: "Dr. Michael Chen",
        specialty: "General Practitioner",
        date: "2024-01-18",
        time: "2:30 PM",
        type: "Video Consultation",
        status: "scheduled",
        duration: "45 min",
        reason: "General health checkup",
        joinUrl: "/consultations/room/2"
      }
    ],
    active: [
      {
        id: 3,
        patient: "Michael Brown",
        doctor: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        date: "2024-01-12",
        time: "3:00 PM",
        type: "Video Consultation",
        status: "in-progress",
        duration: "45 min",
        reason: "Skin condition consultation",
        joinUrl: "/consultations/room/3",
        startTime: "3:05 PM",
        participants: 2
      }
    ],
    completed: [
      {
        id: 4,
        patient: "Robert Wilson",
        doctor: "Dr. David Kim",
        specialty: "Orthopedic Surgeon",
        date: "2024-01-10",
        time: "11:00 AM",
        type: "Video Consultation",
        status: "completed",
        duration: "60 min",
        reason: "Knee pain consultation",
        recording: true,
        notes: "Patient showed improvement with prescribed exercises"
      },
      {
        id: 5,
        patient: "Lisa Thompson",
        doctor: "Dr. Lisa Thompson",
        specialty: "Pediatrician",
        date: "2024-01-08",
        time: "4:00 PM",
        type: "Video Consultation",
        status: "completed",
        duration: "30 min",
        reason: "Child's fever consultation",
        recording: false,
        notes: "Recommended over-the-counter medication and follow-up if symptoms persist"
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "in-progress":
        return <Video className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Consultations</h1>
            <p className="text-gray-600 mt-1">Connect with healthcare providers remotely</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Consultation
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
                  <p className="text-2xl font-bold text-gray-900">{consultations.upcoming.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{consultations.active.length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{consultations.completed.length}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <CheckCircle className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Consultation Banner */}
        {consultations.active.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Video className="mr-2 h-5 w-5" />
                Active Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-green-800">
                      Consultation with {consultations.active[0].doctor}
                    </p>
                    <p className="text-sm text-green-600">
                      Started at {consultations.active[0].startTime} • {consultations.active[0].participants} participants
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                  <Button size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Rejoin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({consultations.upcoming.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({consultations.active.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({consultations.completed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>Your scheduled video consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.upcoming.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/doctor-${consultation.id}.jpg`} />
                          <AvatarFallback>
                            {consultation.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{consultation.doctor}</h3>
                          <p className="text-sm text-gray-600">{consultation.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{consultation.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{consultation.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{consultation.reason}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(consultation.status)}>
                          {getStatusIcon(consultation.status)}
                          <span className="ml-1">{consultation.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          Duration: {consultation.duration}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                          <Button size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Consultations</CardTitle>
                <CardDescription>Currently ongoing video consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.active.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <Avatar>
                          <AvatarImage src={`/doctor-${consultation.id}.jpg`} />
                          <AvatarFallback>
                            {consultation.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{consultation.doctor}</h3>
                          <p className="text-sm text-gray-600">{consultation.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-green-600">
                              <Clock className="h-3 w-3" />
                              <span>Started at {consultation.startTime}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-green-600">
                              <Users className="h-3 w-3" />
                              <span>{consultation.participants} participants</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{consultation.reason}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(consultation.status)}>
                          {getStatusIcon(consultation.status)}
                          <span className="ml-1">{consultation.status}</span>
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </Button>
                          <Button size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Rejoin
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
                <CardTitle>Completed Consultations</CardTitle>
                <CardDescription>Your past video consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.completed.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/doctor-${consultation.id}.jpg`} />
                          <AvatarFallback>
                            {consultation.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{consultation.doctor}</h3>
                          <p className="text-sm text-gray-600">{consultation.specialty}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{consultation.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{consultation.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{consultation.reason}</p>
                          <p className="text-sm text-gray-500 mt-1">{consultation.notes}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(consultation.status)}>
                          {getStatusIcon(consultation.status)}
                          <span className="ml-1">{consultation.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          Duration: {consultation.duration}
                        </div>
                        {consultation.recording && (
                          <Badge variant="outline" className="text-xs">
                            Recording Available
                          </Badge>
                        )}
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}