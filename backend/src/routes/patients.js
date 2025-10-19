const express = require('express');
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', '-password');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== patient.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor', 'specialization consultationFee')
      .populate('doctor.user', 'profile.firstName profile.lastName')
      .sort({ scheduledAt: -1 })
      .limit(5);

    res.json({
      patient,
      recentAppointments: appointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/medical-history', auth, authorize('patient'), [
  body('medicalHistory').isArray(),
  body('allergies').isArray(),
  body('medications').isArray(),
  body('emergencyContact.name').optional().notEmpty(),
  body('emergencyContact.phone').optional().isMobilePhone(),
  body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('height').optional().isFloat({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findOne({ user: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const updates = req.body;
    Object.assign(patient, updates);
    patient.updatedAt = new Date();

    await patient.save();

    res.json({
      message: 'Patient profile updated successfully',
      patient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/appointments', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const patient = await Patient.findOne({ user: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== patient.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query = { patient: patient._id };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'specialization consultationFee')
      .populate('doctor.user', 'profile.firstName profile.lastName profile.profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ scheduledAt: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/medical-records', auth, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== patient.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      medications: patient.medications,
      emergencyContact: patient.emergencyContact,
      bloodType: patient.bloodType,
      height: patient.height,
      weight: patient.weight
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;