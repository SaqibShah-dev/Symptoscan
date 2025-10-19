"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  Menu, 
  Home, 
  Calendar, 
  Users, 
  Stethoscope, 
  Video, 
  FileText, 
  Pill, 
  Settings, 
  Bell,
  Search,
  LogOut
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "patient" | "doctor" | "admin"
}

const navigation = {
  patient: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Find Doctors", href: "/doctors", icon: Stethoscope },
    { name: "Consultations", href: "/consultations", icon: Video },
    { name: "Medical Records", href: "/medical-records", icon: FileText },
    { name: "Prescriptions", href: "/prescriptions", icon: Pill },
    { name: "AI Symptom Checker", href: "/ai/symptom-checker", icon: Heart },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  doctor: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Consultations", href: "/consultations", icon: Video },
    { name: "Prescriptions", href: "/prescriptions", icon: Pill },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Users", href: "/users", icon: Users },
    { name: "Doctors", href: "/doctors", icon: Stethoscope },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
}

export function DashboardLayout({ children, userRole = "patient" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const userNavigation = navigation[userRole] || navigation.patient

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Heart className="h-8 w-8 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-gray-900">TeleMed AI</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {userNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>
                {userRole === "patient" ? "P" : userRole === "doctor" ? "D" : "A"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3 justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex items-center h-16 px-6 border-b border-gray-200">
                    <Heart className="h-8 w-8 text-blue-600 mr-3" />
                    <span className="text-xl font-bold text-gray-900">TeleMed AI</span>
                  </div>
                  
                  <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {userNavigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
              
              <div className="ml-4 flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
              
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>
                    {userRole === "patient" ? "P" : userRole === "doctor" ? "D" : "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                  John Doe
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}