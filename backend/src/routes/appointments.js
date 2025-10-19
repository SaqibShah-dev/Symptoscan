const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, authorize('patient'), [
  body('doctor').isMongoId(),
  body('type').isIn(['video', 'in-person', 'chat']),
  body('scheduledAt').isISO8601(),
  body('duration').isInt({ min: 15, max: 120 }),
  body('reason').notEmpty().isLength({ max: 500 }),
  body('symptoms').isArray(),
  body('notes').optional().isLength({ max: 1000 })
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

    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctor._id,
      scheduledAt: {
        $gte: new Date(req.body.scheduledAt),
        $lt: new Date(new Date(req.body.scheduledAt).getTime() + req.body.duration * 60000)
      },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'Doctor is not available at this time' });
    }

    const appointment = new Appointment({
      patient: patient._id,
      doctor: doctor._id,
      type: req.body.type,
      scheduledAt: new Date(req.body.scheduledAt),
      duration: req.body.duration,
      reason: req.body.reason,
      symptoms: req.body.symptoms,
      notes: req.body.notes,
      amount: doctor.consultationFee
    });

    if (req.body.type === 'video') {
      appointment.meetingLink = `https://meet.telemedicine.com/${appointment._id}`;
    }

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, startDate, endDate } = req.query;
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

    if (startDate && endDate) {
      query.scheduledAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName profile.profileImage')
      .populate('doctor', 'specialization consultationFee')
      .populate('doctor.user', 'profile.firstName profile.lastName profile.profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ scheduledAt: 1 });

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

router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName profile.profileImage')
      .populate('doctor', 'specialization consultationFee')
      .populate('doctor.user', 'profile.firstName profile.lastName profile.profileImage');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || appointment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', auth, [
  body('status').isIn(['confirmed', 'cancelled', 'in-progress', 'completed', 'no-show'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || appointment.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      if (req.body.status === 'confirmed' || req.body.status === 'in-progress') {
        return res.status(403).json({ error: 'Patients cannot confirm or start appointments' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    appointment.status = req.body.status;
    appointment.updatedAt = new Date();

    await appointment.save();

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/doctor/:doctorId/available-slots', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const daySlots = doctor.availableSlots.find(slot => slot.day === dayOfWeek);
    if (!daySlots) {
      return res.json({ availableSlots: [] });
    }

    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      scheduledAt: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    const bookedSlots = existingAppointments.map(appt => ({
      start: appt.scheduledAt,
      end: new Date(appt.scheduledAt.getTime() + appt.duration * 60000)
    }));

    const availableSlots = [];
    const startTime = new Date(`${targetDate.toDateString()} ${daySlots.startTime}`);
    const endTime = new Date(`${targetDate.toDateString()} ${daySlots.endTime}`);

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000);
      
      const isBooked = bookedSlots.some(booked => 
        (currentTime >= booked.start && currentTime < booked.end) ||
        (slotEnd > booked.start && slotEnd <= booked.end)
      );

      if (!isBooked) {
        availableSlots.push({
          start: new Date(currentTime),
          end: slotEnd
        });
      }

      currentTime = slotEnd;
    }

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;