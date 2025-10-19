import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaStethoscope,
  FaRobot,
  FaFileMedical,
  FaPrescriptionBottle,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/doctors', icon: FaUserMd, label: 'Find Doctors' },
    { path: '/appointments/book', icon: FaCalendarAlt, label: 'Book Appointment' },
    { path: '/appointments', icon: FaCalendarAlt, label: 'My Appointments' },
    { path: '/ai/symptom-checker', icon: FaRobot, label: 'AI Symptom Checker' },
    // { path: '/medical-records', icon: FaFileMedical, label: 'Medical Records' },
    // { path: '/prescriptions', icon: FaPrescriptionBottle, label: 'Prescriptions' },
    { path: '/profile', icon: FaUser, label: 'My Profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg z-10">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar