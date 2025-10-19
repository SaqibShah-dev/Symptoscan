import React from 'react'
import { useQuery } from 'react-query'
// import { useAuth } from '../../context/AuthContext'
// import api from '../../services/api'
import {
  FaUserMd,
  FaCalendarAlt,
  FaVideo,
  FaChartLine,
  FaClock,
  FaStar,
  FaRobot,
} from 'react-icons/fa'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const user = {
  _id: 'u12345',
  role: 'patient', // or 'doctor'
  profile: {
    firstName: 'Saqib',
    lastName: 'Shah',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
};

const Dashboard = () => {
  // const { user } = useAuth()

  const { data: appointments, isLoading: appointmentsLoading } = useQuery(
    'appointments',
    // async () => {
    //   // const response = await api.get('/appointments?limit=5')
    //   // return response.data.appointments
    // },
    // {
    //   enabled: user?.role === 'patient',
    // }
  )

  // const { data: doctorAppointments, isLoading: doctorAppointmentsLoading } = useQuery(
  //   'doctor-appointments',
  //   // async () => {
  //   //   const response = await api.get('/appointments?limit=5')
  //   //   return response.data.appointments
  //   // },
  //   {
  //     enabled: user?.role === 'doctor',
  //   }
  // )

  const { data: doctors, isLoading: doctorsLoading } = useQuery(
    'top-doctors',
    // async () => {
    //   const response = await api.get('/doctors?limit=4')
    //   return response.data.doctors
    // }
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()},
           {/* {user?.profile?.firstName}! */}
        </h1>
        <p className="text-gray-600">Welcome back to your TeleMed AI dashboard</p>
      </div>

      {user?.role === 'patient' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <FaCalendarAlt className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <FaClock className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Video Consultations</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <FaVideo className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
              <FaChartLine className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {user?.role === 'patient' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            </div>
            <div className="p-6">
              {appointmentsLoading ? (
                <LoadingSpinner />
              ) : appointments?.length > 0 ? (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FaUserMd className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {appointment.doctor.user.profile.firstName} {appointment.doctor.user.profile.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.scheduledAt).toLocaleDateString()} at{' '}
                            {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.role === 'patient' ? 'Top Rated Doctors' : 'Your Statistics'}
            </h2>
          </div>
          <div className="p-6">
            {doctorsLoading ? (
              <LoadingSpinner />
            ) : user?.role === 'patient' && doctors?.length > 0 ? (
              <div className="space-y-4">
                {doctors.slice(0, 3).map((doctor) => (
                  <div key={doctor._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={doctor.user.profile.profileImage || `https://ui-avatars.com/api/?name=${doctor.user.profile.firstName}+${doctor.user.profile.lastName}&background=3b82f6&color=fff`}
                        alt={doctor.user.profile.firstName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Dr. {doctor.user.profile.firstName} {doctor.user.profile.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : user?.role === 'doctor' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">24</p>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">4.8</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-sm text-gray-600">Consultations</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">$2,450</p>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {user?.role === 'patient' && (
              <>
                <button className="flex flex-col items-center justify-center p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <FaUserMd className="w-8 h-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-primary-900">Find Doctors</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <FaCalendarAlt className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">Book Appointment</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <FaVideo className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">Start Consultation</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <FaRobot className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">AI Symptom Check</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard