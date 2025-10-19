"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Share2, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Activity,
  Heart,
  Stethoscope,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  XRay,
  TestTube,
  Pill
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const medicalRecords = {
    all: [
      {
        id: 1,
        type: "Blood Test",
        date: "2024-01-10",
        doctor: "Dr. Sarah Johnson",
        status: "completed",
        category: "laboratory",
        description: "Complete blood count, lipid panel, and metabolic panel",
        results: "Normal ranges across all parameters",
        hasAttachment: true,
        fileSize: "2.3 MB"
      },
      {
        id: 2,
        type: "X-Ray",
        date: "2024-01-08",
        doctor: "Dr. Michael Chen",
        status: "completed",
        category: "imaging",
        description: "Chest X-ray for respiratory evaluation",
        results: "No acute cardiopulmonary abnormalities",
        hasAttachment: true,
        fileSize: "5.1 MB"
      },
      {
        id: 3,
        type: "ECG",
        date: "2024-01-05",
        doctor: "Dr. Sarah Johnson",
        status: "completed",
        category: "cardiology",
        description: "Resting electrocardiogram",
        results: "Normal sinus rhythm",
        hasAttachment: true,
        fileSize: "1.2 MB"
      },
      {
        id: 4,
        type: "Physical Examination",
        date: "2024-01-03",
        doctor: "Dr. Emily Rodriguez",
        status: "completed",
        category: "examination",
        description: "Annual physical examination",
        results: "Good overall health, blood pressure slightly elevated",
        hasAttachment: true,
        fileSize: "890 KB"
      },
      {
        id: 5,
        type: "MRI",
        date: "2023-12-20",
        doctor: "Dr. David Kim",
        status: "completed",
        category: "imaging",
        description: "Knee MRI for joint pain evaluation",
        results: "Mild cartilage degeneration in medial compartment",
        hasAttachment: true,
        fileSize: "12.4 MB"
      },
      {
        id: 6,
        type: "Urinalysis",
        date: "2023-12-15",
        doctor: "Dr. Lisa Thompson",
        status: "pending",
        category: "laboratory",
        description: "Routine urine analysis",
        results: "Pending",
        hasAttachment: false,
        fileSize: "-"
      }
    ],
    laboratory: [
      {
        id: 1,
        type: "Blood Test",
        date: "2024-01-10",
        doctor: "Dr. Sarah Johnson",
        status: "completed",
        category: "laboratory",
        description: "Complete blood count, lipid panel, and metabolic panel",
        results: "Normal ranges across all parameters",
        hasAttachment: true,
        fileSize: "2.3 MB"
      },
      {
        id: 6,
        type: "Urinalysis",
        date: "2023-12-15",
        doctor: "Dr. Lisa Thompson",
        status: "pending",
        category: "laboratory",
        description: "Routine urine analysis",
        results: "Pending",
        hasAttachment: false,
        fileSize: "-"
      }
    ],
    imaging: [
      {
        id: 2,
        type: "X-Ray",
        date: "2024-01-08",
        doctor: "Dr. Michael Chen",
        status: "completed",
        category: "imaging",
        description: "Chest X-ray for respiratory evaluation",
        results: "No acute cardiopulmonary abnormalities",
        hasAttachment: true,
        fileSize: "5.1 MB"
      },
      {
        id: 5,
        type: "MRI",
        date: "2023-12-20",
        doctor: "Dr. David Kim",
        status: "completed",
        category: "imaging",
        description: "Knee MRI for joint pain evaluation",
        results: "Mild cartilage degeneration in medial compartment",
        hasAttachment: true,
        fileSize: "12.4 MB"
      }
    ],
    examinations: [
      {
        id: 3,
        type: "ECG",
        date: "2024-01-05",
        doctor: "Dr. Sarah Johnson",
        status: "completed",
        category: "cardiology",
        description: "Resting electrocardiogram",
        results: "Normal sinus rhythm",
        hasAttachment: true,
        fileSize: "1.2 MB"
      },
      {
        id: 4,
        type: "Physical Examination",
        date: "2024-01-03",
        doctor: "Dr. Emily Rodriguez",
        status: "completed",
        category: "examination",
        description: "Annual physical examination",
        results: "Good overall health, blood pressure slightly elevated",
        hasAttachment: true,
        fileSize: "890 KB"
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "laboratory":
        return <TestTube className="h-4 w-4" />
      case "imaging":
        return <XRay className="h-4 w-4" />
      case "cardiology":
        return <Heart className="h-4 w-4" />
      case "examination":
        return <Stethoscope className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredRecords = (records: any[]) => {
    return records.filter(record =>
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-1">Access and manage your health information</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{medicalRecords.all.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Laboratory</p>
                  <p className="text-2xl font-bold text-gray-900">{medicalRecords.laboratory.length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <TestTube className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imaging</p>
                  <p className="text-2xl font-bold text-gray-900">{medicalRecords.imaging.length}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <XRay className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Calendar className="h-6 w-6 text-orange-600" />
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
                placeholder="Search records by type, doctor, or description..."
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
            <TabsTrigger value="all">All Records ({medicalRecords.all.length})</TabsTrigger>
            <TabsTrigger value="laboratory">Laboratory ({medicalRecords.laboratory.length})</TabsTrigger>
            <TabsTrigger value="imaging">Imaging ({medicalRecords.imaging.length})</TabsTrigger>
            <TabsTrigger value="examinations">Examinations ({medicalRecords.examinations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Medical Records</CardTitle>
                <CardDescription>Your complete medical history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords(medicalRecords.all).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getCategoryIcon(record.category)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{record.type}</h3>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{record.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{record.doctor}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <span>{record.fileSize}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {record.results}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          {record.hasAttachment && (
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="laboratory">
            <Card>
              <CardHeader>
                <CardTitle>Laboratory Results</CardTitle>
                <CardDescription>Blood tests, urinalysis, and other lab work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords(medicalRecords.laboratory).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TestTube className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{record.type}</h3>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{record.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{record.doctor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {record.results}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          {record.hasAttachment && (
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imaging">
            <Card>
              <CardHeader>
                <CardTitle>Imaging Studies</CardTitle>
                <CardDescription>X-rays, MRIs, CT scans, and other imaging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords(medicalRecords.imaging).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <XRay className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{record.type}</h3>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{record.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{record.doctor}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <span>{record.fileSize}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {record.results}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examinations">
            <Card>
              <CardHeader>
                <CardTitle>Physical Examinations</CardTitle>
                <CardDescription>Physical exams, ECGs, and other examinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords(medicalRecords.examinations).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getCategoryIcon(record.category)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{record.type}</h3>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{record.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{record.doctor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {record.results}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          {record.hasAttachment && (
                            <Button size="sm" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          )}
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