import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaVideo, FaUserMd, FaClock } from 'react-icons/fa'
import api from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const AppointmentsList = () => {
  const { data: appointments, isLoading } = useQuery(
    'my-appointments',
    async () => {
      const response = await api.get('/appointments')
      return response.data.appointments
    }
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no-show':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo className="w-4 h-4" />
      case 'in-person':
        return <FaUserMd className="w-4 h-4" />
      default:
        return <FaCalendarAlt className="w-4 h-4" />
    }
  }

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status })
      window.location.reload()
    } catch (error) {
      console.error('Failed to update appointment status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">Manage your scheduled consultations</p>
        </div>
        <Link
          to="/appointments/book"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Book New Appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {appointments?.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(appointment.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {appointment.doctor.user.profile.firstName} {appointment.doctor.user.profile.lastName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{appointment.doctor.specialization}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>{new Date(appointment.scheduledAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaClock className="w-4 h-4" />
                        <span>{new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className="capitalize">{appointment.type} consultation</span>
                    </div>
                    {appointment.reason && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                    )}
                    {appointment.meetingLink && appointment.status === 'confirmed' && (
                      <div className="mt-3">
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaVideo className="w-4 h-4" />
                          <span>Join Video Call</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {appointment.status === 'scheduled' && (
                    <button
                      onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <Link
                    to={`/doctors/${appointment.doctor._id}`}
                    className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    View Doctor
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-600 mb-6">Book your first consultation with a healthcare professional</p>
            <Link
              to="/appointments/book"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentsList