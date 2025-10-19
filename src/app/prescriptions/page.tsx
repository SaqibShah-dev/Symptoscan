"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Pill, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  Download,
  Share2,
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Info,
  AlertTriangle
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchTerm, setSearchTerm] = useState("")

  const prescriptions = {
    active: [
      {
        id: 1,
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Johnson",
        prescribedDate: "2024-01-01",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        refillsRemaining: 3,
        totalRefills: 5,
        instructions: "Take one tablet by mouth once daily in the morning",
        status: "active",
        pharmacy: "CVS Pharmacy #1234",
        lastFilled: "2024-01-01",
        nextRefillDate: "2024-02-01",
        quantity: "30 tablets",
        daysSupply: 30
      },
      {
        id: 2,
        medication: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Michael Chen",
        prescribedDate: "2024-01-01",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        refillsRemaining: 11,
        totalRefills: 12,
        instructions: "Take one tablet by mouth twice daily with meals",
        status: "active",
        pharmacy: "Walgreens #5678",
        lastFilled: "2024-01-01",
        nextRefillDate: "2024-02-01",
        quantity: "60 tablets",
        daysSupply: 30
      },
      {
        id: 3,
        medication: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Johnson",
        prescribedDate: "2023-12-15",
        startDate: "2023-12-15",
        endDate: "2024-12-15",
        refillsRemaining: 2,
        totalRefills: 4,
        instructions: "Take one tablet by mouth once daily in the evening",
        status: "active",
        pharmacy: "CVS Pharmacy #1234",
        lastFilled: "2023-12-15",
        nextRefillDate: "2024-01-15",
        quantity: "30 tablets",
        daysSupply: 30
      }
    ],
    expired: [
      {
        id: 4,
        medication: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        prescribedBy: "Dr. Emily Rodriguez",
        prescribedDate: "2023-11-01",
        startDate: "2023-11-01",
        endDate: "2023-11-14",
        refillsRemaining: 0,
        totalRefills: 0,
        instructions: "Take one capsule by mouth three times daily for 14 days",
        status: "expired",
        pharmacy: "CVS Pharmacy #1234",
        lastFilled: "2023-11-01",
        nextRefillDate: "N/A",
        quantity: "42 capsules",
        daysSupply: 14
      }
    ],
    completed: [
      {
        id: 5,
        medication: "Ibuprofen",
        dosage: "400mg",
        frequency: "As needed",
        prescribedBy: "Dr. David Kim",
        prescribedDate: "2023-10-15",
        startDate: "2023-10-15",
        endDate: "2023-11-15",
        refillsRemaining: 0,
        totalRefills: 1,
        instructions: "Take one tablet by mouth every 6 hours as needed for pain",
        status: "completed",
        pharmacy: "Walgreens #5678",
        lastFilled: "2023-10-15",
        nextRefillDate: "N/A",
        quantity: "30 tablets",
        daysSupply: 30
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "expired":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Pill className="h-4 w-4" />
    }
  }

  const getRefillProgress = (remaining: number, total: number) => {
    return ((total - remaining) / total) * 100
  }

  const filteredPrescriptions = (prescriptionsList: any[]) => {
    return prescriptionsList.filter(prescription =>
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.pharmacy.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const needsRefillSoon = (prescription: any) => {
    if (prescription.refillsRemaining === 0) return false
    const today = new Date()
    const refillDate = new Date(prescription.nextRefillDate)
    const diffTime = refillDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-1">Manage your medications and refills</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Prescription
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{prescriptions.active.length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Pill className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Refill</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.active.filter(p => needsRefillSoon(p)).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">{prescriptions.expired.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Refills</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.active.reduce((sum, p) => sum + p.refillsRemaining, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refill Alerts */}
        {prescriptions.active.filter(p => needsRefillSoon(p)).length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Refill Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prescriptions.active
                  .filter(p => needsRefillSoon(p))
                  .map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">{prescription.medication}</p>
                        <p className="text-sm text-yellow-600">
                          Refill available on {prescription.nextRefillDate}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Request Refill
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prescriptions by medication, doctor, or pharmacy..."
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
            <TabsTrigger value="active">Active ({prescriptions.active.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({prescriptions.expired.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({prescriptions.completed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Prescriptions</CardTitle>
                <CardDescription>Your current medications and refills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions(prescriptions.active).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Pill className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{prescription.medication}</h3>
                          <p className="text-sm text-gray-600">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Prescribed: {prescription.prescribedDate}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Next refill: {prescription.nextRefillDate}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{prescription.instructions}</p>
                          {needsRefillSoon(prescription) && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600 mt-2">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Refill available soon
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(prescription.status)}>
                          {getStatusIcon(prescription.status)}
                          <span className="ml-1">{prescription.status}</span>
                        </Badge>
                        
                        <div className="text-sm text-gray-600">
                          <p>Pharmacy: {prescription.pharmacy}</p>
                          <p>Refills: {prescription.refillsRemaining} of {prescription.totalRefills}</p>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${getRefillProgress(prescription.refillsRemaining, prescription.totalRefills)}%`
                            }}
                          ></div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refill
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
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

          <TabsContent value="expired">
            <Card>
              <CardHeader>
                <CardTitle>Expired Prescriptions</CardTitle>
                <CardDescription>Prescriptions that are no longer valid</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions(prescriptions.expired).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Pill className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{prescription.medication}</h3>
                          <p className="text-sm text-gray-600">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Prescribed: {prescription.prescribedDate}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Expired: {prescription.endDate}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{prescription.instructions}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(prescription.status)}>
                          {getStatusIcon(prescription.status)}
                          <span className="ml-1">{prescription.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          <p>Pharmacy: {prescription.pharmacy}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
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

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Prescriptions</CardTitle>
                <CardDescription>Finished medication courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions(prescriptions.completed).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Pill className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{prescription.medication}</h3>
                          <p className="text-sm text-gray-600">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Prescribed: {prescription.prescribedDate}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Completed: {prescription.endDate}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{prescription.instructions}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(prescription.status)}>
                          {getStatusIcon(prescription.status)}
                          <span className="ml-1">{prescription.status}</span>
                        </Badge>
                        <div className="text-sm text-gray-600">
                          <p>Pharmacy: {prescription.pharmacy}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}