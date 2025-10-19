const express = require('express');
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      specialization, 
      search, 
      minRating,
      availableOnly = false 
    } = req.query;
    
    let query = { isVerified: true };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (search) {
      const userQuery = {
        $or: [
          { 'profile.firstName': { $regex: search, $options: 'i' } },
          { 'profile.lastName': { $regex: search, $options: 'i' } }
        ]
      };
      
      const users = await User.find(userQuery).select('_id');
      const userIds = users.map(user => user._id);
      
      query.user = { $in: userIds };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (availableOnly === 'true') {
      query.status = 'available';
    }

    const doctors = await Doctor.find(query)
      .populate('user', 'profile.firstName profile.lastName profile.email profile.profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, totalReviews: -1 });

    const total = await Doctor.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', '-password');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledAt: { $gte: new Date() }
    });

    res.json({
      doctor,
      upcomingAppointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/profile', auth, authorize('doctor'), [
  body('specialization').notEmpty(),
  body('licenseNumber').notEmpty(),
  body('experience').isInt({ min: 0 }),
  body('consultationFee').isFloat({ min: 0 }),
  body('bio').optional().isLength({ max: 1000 }),
  body('availableSlots').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const updates = req.body;
    Object.assign(doctor, updates);
    doctor.updatedAt = new Date();

    await doctor.save();

    res.json({
      message: 'Doctor profile updated successfully',
      doctor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', auth, authorize('doctor'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    doctor.status = status;
    doctor.updatedAt = new Date();

    await doctor.save();

    res.json({
      message: 'Status updated successfully',
      status: doctor.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/specializations/list', async (req, res) => {
  try {
    const specializations = await Doctor.distinct('specialization', { isVerified: true });
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;