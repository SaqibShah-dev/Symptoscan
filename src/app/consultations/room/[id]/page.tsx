"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Phone,
  MessageSquare,
  Users,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Clock,
  Heart,
  Stethoscope,
  User,
  Settings,
  Fullscreen,
  FullscreenExit
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function ConsultationRoomPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: "Dr. Sarah Johnson", text: "Hello! How are you feeling today?", time: "10:00 AM", isDoctor: true },
    { id: 2, sender: "You", text: "I'm doing better, thank you. The medication seems to be working.", time: "10:01 AM", isDoctor: false },
    { id: 3, sender: "Dr. Sarah Johnson", text: "That's great to hear! Let me check your vitals.", time: "10:02 AM", isDoctor: true }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const consultation = {
    id: 1,
    patient: "John Smith",
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    startTime: "10:00 AM",
    duration: "30 min",
    reason: "Follow-up for hypertension",
    status: "in-progress"
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoctor: false
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="h-screen flex flex-col lg:flex-row bg-gray-900">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <Badge variant="destructive" className="bg-red-600">LIVE</Badge>
              </div>
              <div>
                <h2 className="font-semibold">Consultation with {consultation.doctor}</h2>
                <p className="text-sm text-gray-300">{consultation.specialty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(recordingTime)}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExit className="h-4 w-4" /> : <Fullscreen className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 bg-black relative">
            {/* Main Video (Doctor) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/doctor-1.jpg" />
                    <AvatarFallback className="text-4xl">SJ</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-medium">{consultation.doctor}</p>
                  <p className="text-sm opacity-75">{consultation.specialty}</p>
                </div>
              </div>
            </div>

            {/* Self Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
              <div className="w-full h-full flex items-center justify-center">
                {isVideoOn ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/patient-1.jpg" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2 text-white text-xs">
                You
              </div>
              {!isVideoOn && (
                <div className="absolute top-2 right-2">
                  <VideoOff className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>

            {/* Waiting Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-semibold">Waiting for doctor to join...</p>
                <p className="text-gray-300 mt-2">Please stay connected</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            
            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
            </Button>
            
            <div className="w-px h-8 bg-gray-600"></div>
            
            <Button variant="outline" size="lg">
              <MessageSquare className="h-6 w-6" />
            </Button>
            
            <Button variant="outline" size="lg">
              <Users className="h-6 w-6" />
            </Button>
            
            <Button variant="outline" size="lg">
              <Settings className="h-6 w-6" />
            </Button>
            
            <div className="w-px h-8 bg-gray-600"></div>
            
            <Button variant="destructive" size="lg">
              <Phone className="h-6 w-6 rotate-135" />
            </Button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-96 bg-gray-100 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Chat</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isDoctor ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    message.isDoctor
                      ? 'bg-white border'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-medium ${
                      message.isDoctor ? 'text-gray-900' : 'text-white'
                    }`}>
                      {message.sender}
                    </span>
                    <span className={`text-xs ${
                      message.isDoctor ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.time}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    message.isDoctor ? 'text-gray-700' : 'text-white'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white p-4 border-t">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Consultation Info */}
          <div className="bg-white p-4 border-t">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Consultation ID</span>
                <span className="text-sm font-medium">#{consultation.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium">{consultation.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reason</span>
                <span className="text-sm font-medium">{consultation.reason}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}