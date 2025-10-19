import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaVideo, FaUserMd, FaSearch } from 'react-icons/fa'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import api from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const AppointmentBooking = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [formData, setFormData] = useState({
    type: 'video',
    reason: '',
    symptoms: [''],
    notes: '',
  })

  useEffect(() => {
    if (location.state?.doctorId) {
      fetchDoctorDetails(location.state.doctorId)
    }
  }, [location.state])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedDoctor, selectedDate])

  const { data: doctors, isLoading: doctorsLoading } = useQuery(
    'doctors-list',
    async () => {
      const response = await api.get('/doctors?limit=50')
      return response.data.doctors
    }
  )

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`)
      setSelectedDoctor(response.data.doctor)
    } catch (error) {
      toast.error('Failed to fetch doctor details')
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get(`/appointments/doctor/${selectedDoctor._id}/available-slots?date=${selectedDate.toISOString().split('T')[0]}`)
      setAvailableSlots(response.data.availableSlots)
    } catch (error) {
      toast.error('Failed to fetch available slots')
    }
  }

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value
    const doctor = doctors.find(d => d._id === doctorId)
    setSelectedDoctor(doctor)
    setSelectedTime(null)
  }

  const handleSymptomChange = (index, value) => {
    const newSymptoms = [...formData.symptoms]
    newSymptoms[index] = value
    setFormData({ ...formData, symptoms: newSymptoms })
  }

  const addSymptom = () => {
    setFormData({ ...formData, symptoms: [...formData.symptoms, ''] })
  }

  const removeSymptom = (index) => {
    const newSymptoms = formData.symptoms.filter((_, i) => i !== index)
    setFormData({ ...formData, symptoms: newSymptoms })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedDoctor) {
      toast.error('Please select a doctor')
      return
    }

    if (!selectedTime) {
      toast.error('Please select a time slot')
      return
    }

    try {
      const appointmentData = {
        doctor: selectedDoctor._id,
        type: formData.type,
        scheduledAt: selectedTime,
        duration: 30,
        reason: formData.reason,
        symptoms: formData.symptoms.filter(s => s.trim() !== ''),
        notes: formData.notes,
      }

      const response = await api.post('/appointments', appointmentData)
      toast.success('Appointment booked successfully!')
      navigate('/appointments')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to book appointment')
    }
  }

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date < today
    }
    return false
  }

  if (doctorsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600">Schedule your consultation with a healthcare professional</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Doctor</h2>
              
              {!location.state?.doctorId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search and Select Doctor
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedDoctor?._id || ''}
                      onChange={handleDoctorChange}
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors?.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.user.profile.firstName} {doctor.user.profile.lastName} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedDoctor && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={selectedDoctor.user.profile.profileImage || `https://ui-avatars.com/api/?name=${selectedDoctor.user.profile.firstName}+${selectedDoctor.user.profile.lastName}&background=3b82f6&color=fff`}
                    alt={selectedDoctor.user.profile.firstName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {selectedDoctor.user.profile.firstName} {selectedDoctor.user.profile.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                    <p className="text-sm text-primary-600">${selectedDoctor.consultationFee} consultation fee</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Date
                  </label>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileDisabled={tileDisabled}
                    className="border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedTime === slot.start
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                          }`}
                          onClick={() => setSelectedTime(slot.start)}
                        >
                          {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-2 text-gray-500 text-center py-4">
                        {selectedDoctor ? 'No available slots for selected date' : 'Select a doctor first'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="video"
                        checked={formData.type === 'video'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mr-2"
                      />
                      <FaVideo className="mr-1" />
                      Video Consultation
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="in-person"
                        checked={formData.type === 'in-person'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mr-2"
                      />
                      <FaUserMd className="mr-1" />
                      In-Person
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Describe the reason for your appointment..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  {formData.symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter symptom..."
                        value={symptom}
                        onChange={(e) => handleSymptomChange(index, e.target.value)}
                      />
                      {formData.symptoms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSymptom(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSymptom}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Add Another Symptom
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/doctors')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
            
            {selectedDoctor && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">
                    Dr. {selectedDoctor.user.profile.firstName} {selectedDoctor.user.profile.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">{selectedDoctor.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString()}
                  </span>
                </div>
                {selectedTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {new Date(selectedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{formData.type}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-bold text-primary-600">
                      ${selectedDoctor.consultationFee}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Please arrive 10 minutes early for your appointment</li>
              <li>• Have your ID and insurance information ready</li>
              <li>• Cancel or reschedule at least 24 hours in advance</li>
              <li>• Video consultations require a stable internet connection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentBooking