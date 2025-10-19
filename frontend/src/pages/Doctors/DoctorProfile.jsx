import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStar, FaCalendarAlt, FaVideo, FaMapMarkerAlt, FaClock, FaDollarSign, FaLanguage } from 'react-icons/fa'
import api from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const DoctorProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState('')

  const { data: doctor, isLoading } = useQuery(
    ['doctor', id],
    async () => {
      const response = await api.get(`/doctors/${id}`)
      return response.data
    }
  )

  const { data: availableSlots } = useQuery(
    ['available-slots', id, selectedDate],
    async () => {
      if (!selectedDate) return null
      const response = await api.get(`/appointments/doctor/${id}/available-slots?date=${selectedDate}`)
      return response.data
    },
    {
      enabled: !!selectedDate,
    }
  )

  const handleBookAppointment = () => {
    navigate('/appointments/book', { state: { doctorId: id } })
  }

  const getRatingStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      )
    }
    return stars
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Doctor not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <img
              src={doctor.doctor.user.profile.profileImage || `https://ui-avatars.com/api/?name=${doctor.doctor.user.profile.firstName}+${doctor.doctor.user.profile.lastName}&background=3b82f6&color=fff`}
              alt={doctor.doctor.user.profile.firstName}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Dr. {doctor.doctor.user.profile.firstName} {doctor.doctor.user.profile.lastName}
              </h1>
              <p className="text-lg text-gray-600">{doctor.doctor.specialization}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  {getRatingStars(doctor.doctor.rating)}
                  <span className="text-sm text-gray-600">
                    ({doctor.doctor.rating}) • {doctor.doctor.totalReviews} reviews
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  doctor.doctor.status === 'available' ? 'bg-green-100 text-green-800' :
                  doctor.doctor.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {doctor.doctor.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <FaClock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {doctor.doctor.experience} years experience
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaDollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    ${doctor.doctor.consultationFee} per consultation
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {doctor.upcomingAppointments} upcoming appointments
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleBookAppointment}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Book Appointment
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FaVideo className="inline mr-2" />
                Video Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">About</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {doctor.doctor.bio || 'No bio available.'}
              </p>
              
              {doctor.doctor.education && doctor.doctor.education.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
                  <div className="space-y-2">
                    {doctor.doctor.education.map((edu, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{edu.degree} - {edu.institution}</span>
                        <span className="text-sm text-gray-500">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctor.doctor.certifications && doctor.doctor.certifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {doctor.doctor.certifications.map((cert, index) => (
                      <div key={index}>
                        <p className="text-gray-600">{cert.name} - {cert.issuedBy}</p>
                        <p className="text-sm text-gray-500">{cert.year} {cert.expiryDate && `- Expires: ${new Date(cert.expiryDate).getFullYear()}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctor.doctor.languages && doctor.doctor.languages.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.doctor.languages.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Hours</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.doctor.availableSlots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900 capitalize">{slot.day}</span>
                    <span className="text-sm text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Book</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {selectedDate && availableSlots && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.availableSlots.slice(0, 6).map((slot, index) => (
                        <button
                          key={index}
                          className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-colors"
                          onClick={() => {
                            navigate('/appointments/book', {
                              state: {
                                doctorId: id,
                                selectedDate,
                                selectedTime: slot.start
                              }
                            })
                          }}
                        >
                          {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookAppointment}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Available Slots
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contact Info</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {doctor.doctor.user.profile.address?.city || 'Location not specified'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaLanguage className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {doctor.doctor.languages?.join(', ') || 'Languages not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile