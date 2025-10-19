import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import DoctorList from './pages/Doctors/DoctorList'
import DoctorProfile from './pages/Doctors/DoctorProfile'
import AppointmentBooking from './pages/Appointments/AppointmentBooking'
import AppointmentsList from './pages/Appointments/AppointmentsList'
import ConsultationRoom from './pages/Consultations/ConsultationRoom'
import SymptomChecker from './pages/AI/SymptomChecker'
import PatientProfile from './pages/Patients/PatientProfile'
// import MedicalRecords from './pages/MedicalRecords/MedicalRecords'
// import Prescriptions from './pages/Prescriptions/Prescriptions'
import LoadingSpinner from './components/UI/LoadingSpinner'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
      />
      {/* <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
      > */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/:id" element={<DoctorProfile />} />
        <Route path="appointments/book" element={<AppointmentBooking />} />
        <Route path="appointments" element={<AppointmentsList />} />
        <Route path="consultations/:id" element={<ConsultationRoom />} />
        <Route path="ai/symptom-checker" element={<SymptomChecker />} />
        <Route path="profile" element={<PatientProfile />} />
        {/* <Route path="medical-records" element={<MedicalRecords />} /> */}
        {/* <Route path="prescriptions" element={<Prescriptions />} /> */}
      {/* </Route> */}
    </Routes>
  )
}

export default App