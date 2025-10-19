const express = require('express');
const { body, validationResult } = require('express-validator');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, authorize('doctor'), [
  body('patient').isMongoId(),
  body('recordType').isIn(['diagnosis', 'treatment', 'lab-result', 'imaging', 'surgery', 'vaccination', 'other']),
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('date').isISO8601(),
  body('attachments').isArray(),
  body('notes').optional().isLength({ max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findById(req.body.patient);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const medicalRecord = new MedicalRecord({
      patient: patient._id,
      doctor: doctor._id,
      recordType: req.body.recordType,
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      attachments: req.body.attachments,
      notes: req.body.notes
    });

    await medicalRecord.save();

    res.status(201).json({
      message: 'Medical record created successfully',
      medicalRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, recordType, startDate, endDate } = req.query;
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

    if (recordType) {
      query.recordType = recordType;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const medicalRecords = await MedicalRecord.find(query)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await MedicalRecord.countDocuments(query);

    res.json({
      medicalRecords,
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
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName');

    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || medicalRecord.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(medicalRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, authorize('doctor'), [
  body('recordType').optional().isIn(['diagnosis', 'treatment', 'lab-result', 'imaging', 'surgery', 'vaccination', 'other']),
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('date').optional().isISO8601(),
  body('attachments').optional().isArray(),
  body('notes').optional().isLength({ max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const medicalRecord = await MedicalRecord.findById(req.params.id);
    
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || medicalRecord.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = req.body;
    Object.assign(medicalRecord, updates);
    medicalRecord.updatedAt = new Date();

    await medicalRecord.save();

    res.json({
      message: 'Medical record updated successfully',
      medicalRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);
    
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || medicalRecord.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;