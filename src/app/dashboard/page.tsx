"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  Heart, 
  Stethoscope, 
  Video, 
  TrendingUp, 
  Users,
  FileText,
  Pill
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DashboardPage() {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "Video Consultation",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "General Practitioner",
      date: "2024-01-18",
      time: "2:30 PM",
      type: "In-person",
      status: "pending"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "appointment",
      title: "Appointment with Dr. Sarah Johnson",
      date: "2024-01-10",
      status: "completed"
    },
    {
      id: 2,
      type: "prescription",
      title: "New prescription issued",
      date: "2024-01-08",
      status: "active"
    },
    {
      id: 3,
      type: "test_result",
      title: "Blood test results available",
      date: "2024-01-05",
      status: "reviewed"
    }
  ]

  const healthStats = [
    {
      title: "Upcoming Appointments",
      value: "2",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Prescriptions",
      value: "3",
      icon: Pill,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Medical Records",
      value: "12",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Health Score",
      value: "85%",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ]

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
            <p className="text-gray-600 mt-1">Here's your health overview for today</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              Health Improving
            </Badge>
          </div>
        </div>

        {/* Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`/doctor-${appointment.id}.jpg`} />
                          <AvatarFallback>
                            {appointment.doctor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {appointment.date} at {appointment.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={appointment.status === "confirmed" ? "default" : "secondary"}
                          className="mb-2"
                        >
                          {appointment.status}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          {appointment.type === "Video Consultation" ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <Stethoscope className="h-3 w-3" />
                          )}
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Appointments
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest health updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === "appointment" && (
                          <Calendar className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === "prescription" && (
                          <Pill className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === "test_result" && (
                          <FileText className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{activity.date}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              activity.status === "completed" ? "text-green-600 border-green-600" :
                              activity.status === "active" ? "text-blue-600 border-blue-600" :
                              "text-purple-600 border-purple-600"
                            }`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Stethoscope className="h-6 w-6 mb-2" />
                Book Appointment
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Video className="h-6 w-6 mb-2" />
                Start Consultation
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Heart className="h-6 w-6 mb-2" />
                AI Symptom Checker
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                View Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}