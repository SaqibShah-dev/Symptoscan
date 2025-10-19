import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaComment, FaPaperPlane } from 'react-icons/fa'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const ConsultationRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { socket, joinRoom, leaveRoom } = useSocket()
  const { user } = useAuth()
  
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnection = useRef(null)
  
  const { data: appointment, isLoading } = useQuery(
    ['appointment', id],
    async () => {
      const response = await api.get(`/appointments/${id}`)
      return response.data
    }
  )

  const updateAppointmentStatus = useMutation(
    (status) => api.put(`/appointments/${id}/status`, { status }),
    {
      onSuccess: () => {
        if (status === 'in-progress') {
          startConsultation()
        }
      }
    }
  )

  useEffect(() => {
    if (appointment && socket) {
      joinRoom(id)
      
      socket.on('user-connected', handleUserConnected)
      socket.on('user-disconnected', handleUserDisconnected)
      socket.on('video-call', handleVideoCall)
      socket.on('chat-message', handleChatMessage)
      
      return () => {
        leaveRoom(id)
        socket.off('user-connected')
        socket.off('user-disconnected')
        socket.off('video-call')
        socket.off('chat-message')
      }
    }
  }, [appointment, socket, id, joinRoom, leaveRoom])

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream, localVideoRef])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream, remoteVideoRef])

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setLocalStream(stream)
      setIsConnected(true)
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
    
    peerConnection.current = new RTCPeerConnection(configuration)
    
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }
    
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('video-call', {
          roomId: id,
          type: 'ice-candidate',
          candidate: event.candidate
        })
      }
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream)
      })
    }
  }

  const handleUserConnected = async () => {
    if (!peerConnection.current) {
      createPeerConnection()
    }
    
    try {
      const offer = await peerConnection.current.createOffer()
      await peerConnection.current.setLocalDescription(offer)
      
      socket.emit('video-call', {
        roomId: id,
        type: 'offer',
        offer: offer
      })
    } catch (error) {
      console.error('Error creating offer:', error)
    }
  }

  const handleVideoCall = async (data) => {
    if (!peerConnection.current) {
      createPeerConnection()
    }
    
    try {
      if (data.type === 'offer') {
        await peerConnection.current.setRemoteDescription(data.offer)
        const answer = await peerConnection.current.createAnswer()
        await peerConnection.current.setLocalDescription(answer)
        
        socket.emit('video-call', {
          roomId: id,
          type: 'answer',
          answer: answer
        })
      } else if (data.type === 'answer') {
        await peerConnection.current.setRemoteDescription(data.answer)
      } else if (data.type === 'ice-candidate') {
        await peerConnection.current.addIceCandidate(data.candidate)
      }
    } catch (error) {
      console.error('Error handling video call:', error)
    }
  }

  const handleUserDisconnected = () => {
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop())
      setRemoteStream(null)
    }
  }

  const handleChatMessage = (data) => {
    setMessages(prev => [...prev, data])
  }

  const startConsultation = async () => {
    await initializeMedia()
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoEnabled(videoTrack.enabled)
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled
      setIsAudioEnabled(audioTrack.enabled)
    }
  }

  const endCall = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop())
    }
    if (peerConnection.current) {
      peerConnection.current.close()
    }
    
    await updateAppointmentStatus.mutateAsync('completed')
    navigate('/appointments')
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const messageData = {
        roomId: id,
        message: newMessage,
        sender: user._id,
        senderName: `${user.profile.firstName} ${user.profile.lastName}`,
        timestamp: new Date()
      }
      
      socket.emit('chat-message', messageData)
      setMessages(prev => [...prev, messageData])
      setNewMessage('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Not Found</h1>
          <button
            onClick={() => navigate('/appointments')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Consultation with Dr. {appointment.doctor.user.profile.firstName} {appointment.doctor.user.profile.lastName}
                  </h1>
                  <p className="text-gray-400">{appointment.doctor.specialization}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'in-progress' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                  }`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'scheduled' && (
                    <button
                      onClick={() => updateAppointmentStatus.mutate('in-progress')}
                      disabled={updateAppointmentStatus.isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Start Consultation
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">You</h3>
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-center">
                        <LoadingSpinner />
                        <p className="text-white mt-2">Connecting...</p>
                      </div>
                    </div>
                  )}
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {user.profile.firstName[0]}{user.profile.lastName[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">
                  Dr. {appointment.doctor.user.profile.firstName} {appointment.doctor.user.profile.lastName}
                </h3>
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!remoteStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl font-bold">
                            {appointment.doctor.user.profile.firstName[0]}{appointment.doctor.user.profile.lastName[0]}
                          </span>
                        </div>
                        <p className="text-white">Waiting to connect...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full transition-colors ${
                    isVideoEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isVideoEnabled ? <FaVideo className="w-6 h-6" /> : <FaVideoSlash className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={toggleAudio}
                  className={`p-4 rounded-full transition-colors ${
                    isAudioEnabled ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isAudioEnabled ? <FaMicrophone className="w-6 h-6" /> : <FaMicrophoneSlash className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={endCall}
                  className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaPhoneSlash className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <FaComment className="mr-2" />
              Chat
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-xs ${msg.sender === user._id ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === user._id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {msg.senderName}
                  </p>
                </div>
              ))}
            </div>
            
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationRoom