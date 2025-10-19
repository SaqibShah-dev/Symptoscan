import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(process.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token,
        },
      })

      newSocket.on('connect', () => {
        console.log('Connected to socket server')
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server')
      })

      newSocket.on('online-users', (users) => {
        setOnlineUsers(users)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [isAuthenticated, token])

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join-room', roomId)
    }
  }

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave-room', roomId)
    }
  }

  const sendVideoCall = (data) => {
    if (socket) {
      socket.emit('video-call', data)
    }
  }

  const sendChatMessage = (data) => {
    if (socket) {
      socket.emit('chat-message', data)
    }
  }

  const value = {
    socket,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendVideoCall,
    sendChatMessage,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}