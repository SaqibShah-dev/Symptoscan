const express = require('express');
const { body, validationResult } = require('express-validator');
const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, authorize('doctor'), [
  body('appointment').isMongoId(),
  body('diagnosis').optional().isLength({ max: 1000 }),
  body('treatment').optional().isLength({ max: 1000 }),
  body('followUpRequired').isBoolean(),
  body('followUpDate').optional().isISO8601(),
  body('notes').optional().isLength({ max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await Appointment.findById(req.body.appointment);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (appointment.status !== 'in-progress') {
      return res.status(400).json({ error: 'Appointment must be in progress to start consultation' });
    }

    const existingConsultation = await Consultation.findOne({ appointment: appointment._id });
    if (existingConsultation) {
      return res.status(400).json({ error: 'Consultation already exists for this appointment' });
    }

    const consultation = new Consultation({
      appointment: appointment._id,
      doctor: doctor._id,
      patient: appointment.patient,
      type: appointment.type,
      diagnosis: req.body.diagnosis,
      treatment: req.body.treatment,
      followUpRequired: req.body.followUpRequired,
      followUpDate: req.body.followUpDate,
      notes: req.body.notes
    });

    await consultation.save();

    res.status(201).json({
      message: 'Consultation started successfully',
      consultation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
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

    if (type) {
      query.type = type;
    }

    const consultations = await Consultation.find(query)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName profile.profileImage')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName profile.profileImage')
      .populate('appointment', 'scheduledAt type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ startTime: -1 });

    const total = await Consultation.countDocuments(query);

    res.json({
      consultations,
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
    const consultation = await Consultation.findById(req.params.id)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName profile.profileImage')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName profile.profileImage')
      .populate('appointment', 'scheduledAt type reason');

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || consultation.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || consultation.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/end', auth, authorize('doctor'), [
  body('diagnosis').optional().isLength({ max: 1000 }),
  body('treatment').optional().isLength({ max: 1000 }),
  body('followUpRequired').isBoolean(),
  body('followUpDate').optional().isISO8601(),
  body('notes').optional().isLength({ max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || consultation.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (consultation.status !== 'active') {
      return res.status(400).json({ error: 'Consultation is not active' });
    }

    consultation.endTime = new Date();
    consultation.duration = Math.round((consultation.endTime - consultation.startTime) / 60000);
    consultation.status = 'completed';
    consultation.diagnosis = req.body.diagnosis || consultation.diagnosis;
    consultation.treatment = req.body.treatment || consultation.treatment;
    consultation.followUpRequired = req.body.followUpRequired;
    consultation.followUpDate = req.body.followUpDate;
    consultation.notes = req.body.notes || consultation.notes;

    await consultation.save();

    const appointment = await Appointment.findById(consultation.appointment);
    if (appointment) {
      appointment.status = 'completed';
      await appointment.save();
    }

    res.json({
      message: 'Consultation ended successfully',
      consultation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/rating', auth, authorize('patient'), [
  body('doctorRating').isInt({ min: 1, max: 5 }),
  body('review').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || consultation.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (consultation.status !== 'completed') {
      return res.status(400).json({ error: 'Consultation must be completed to rate' });
    }

    consultation.rating = {
      doctorRating: req.body.doctorRating,
      review: req.body.review
    };

    await consultation.save();

    const doctor = await Doctor.findById(consultation.doctor);
    if (doctor) {
      const allRatings = await Consultation.find({
        doctor: doctor._id,
        'rating.doctorRating': { $exists: true }
      }).select('rating.doctorRating');

      const totalRating = allRatings.reduce((sum, c) => sum + c.rating.doctorRating, 0);
      doctor.rating = totalRating / allRatings.length;
      doctor.totalReviews = allRatings.length;
      await doctor.save();
    }

    res.json({
      message: 'Rating submitted successfully',
      consultation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;