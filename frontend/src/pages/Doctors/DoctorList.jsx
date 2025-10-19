import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import { FaSearch, FaFilter, FaStar, FaCalendarAlt, FaVideo } from 'react-icons/fa'

const DoctorList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [minRating, setMinRating] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const navigate = useNavigate()

  const { data: doctorsData, isLoading } = useQuery(
    ['doctors', { searchTerm, selectedSpecialization, minRating, currentPage }],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedSpecialization) params.append('specialization', selectedSpecialization)
      if (minRating) params.append('minRating', minRating)

      const response = await api.get(`/doctors?${params}`)
      return response.data
    }
  )

  const { data: specializations } = useQuery(
    'specializations',
    async () => {
      const response = await api.get('/doctors/specializations/list')
      return response.data
    }
  )

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`)
  }

  const handleBookAppointment = (doctorId) => {
    navigate('/appointments/book', { state: { doctorId } })
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
        <p className="text-gray-600">Connect with qualified healthcare professionals</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations?.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>

          <button
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => {
              setSearchTerm('')
              setSelectedSpecialization('')
              setMinRating('')
            }}
          >
            <FaFilter className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorsData?.doctors?.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={doctor.user.profile.profileImage || `https://ui-avatars.com/api/?name=${doctor.user.profile.firstName}+${doctor.user.profile.lastName}&background=3b82f6&color=fff`}
                      alt={doctor.user.profile.firstName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {doctor.user.profile.firstName} {doctor.user.profile.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {getRatingStars(doctor.rating)}
                        <span className="text-sm text-gray-600">
                          ({doctor.rating}) • {doctor.totalReviews} reviews
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          doctor.status === 'available' ? 'bg-green-100 text-green-800' :
                          doctor.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doctor.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {doctor.experience} years experience
                        </span>
                      </div>
                    </div>
                  </div>

                  {doctor.bio && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {doctor.bio}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="text-lg font-semibold text-primary-600">
                        ${doctor.consultationFee}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDoctorClick(doctor._id)}
                        className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleBookAppointment(doctor._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {doctorsData?.doctors?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No doctors found matching your criteria.</p>
            </div>
          )}

          {doctorsData?.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {doctorsData.totalPages}
              </span>
              <button
                disabled={currentPage === doctorsData.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DoctorList