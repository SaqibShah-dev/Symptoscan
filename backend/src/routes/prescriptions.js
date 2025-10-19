const express = require('express');
const { body, validationResult } = require('express-validator');
const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, authorize('doctor'), [
  body('consultation').isMongoId(),
  body('medications').isArray(),
  body('medications.*.name').notEmpty(),
  body('medications.*.dosage').notEmpty(),
  body('medications.*.frequency').notEmpty(),
  body('medications.*.duration').notEmpty(),
  body('medications.*.quantity').isInt({ min: 1 }),
  body('diagnosis').notEmpty().isLength({ max: 1000 }),
  body('notes').optional().isLength({ max: 1000 }),
  body('expiryDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const consultation = await Consultation.findById(req.body.consultation);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || consultation.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (consultation.status !== 'completed') {
      return res.status(400).json({ error: 'Consultation must be completed to prescribe' });
    }

    const existingPrescription = await Prescription.findOne({ consultation: consultation._id });
    if (existingPrescription) {
      return res.status(400).json({ error: 'Prescription already exists for this consultation' });
    }

    const prescription = new Prescription({
      consultation: consultation._id,
      doctor: doctor._id,
      patient: consultation.patient,
      medications: req.body.medications,
      diagnosis: req.body.diagnosis,
      notes: req.body.notes,
      expiryDate: new Date(req.body.expiryDate)
    });

    await prescription.save();

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let query = {};

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        return res.status(404).json({ error: 'Patient profile not found' });
      }
      query.patient = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      query.doctor = doctor._id;
    }

    if (status) {
      query.status = status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName')
      .populate('consultation', 'startTime endTime type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Prescription.countDocuments(query);

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName')
      .populate('consultation', 'startTime endTime type');

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || prescription.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || prescription.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', auth, authorize('doctor'), [
  body('status').isIn(['active', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || prescription.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    prescription.status = req.body.status;
    prescription.updatedAt = new Date();

    await prescription.save();

    res.json({
      message: 'Prescription status updated successfully',
      prescription
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;