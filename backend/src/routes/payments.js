const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', auth, authorize('patient'), [
  body('appointment').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await Appointment.findById(req.body.appointment)
      .populate('doctor', 'consultationFee');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Appointment already paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointment.amount * 100),
      currency: 'usd',
      metadata: {
        appointmentId: appointment._id.toString(),
        patientId: patient._id.toString(),
        doctorId: appointment.doctor.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: appointment.amount,
      appointmentId: appointment._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/confirm-payment', auth, authorize('patient'), [
  body('paymentIntentId').notEmpty(),
  body('appointment').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(req.body.paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not successful' });
    }

    const appointment = await Appointment.findById(req.body.appointment);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const payment = new Payment({
      appointment: appointment._id,
      patient: patient._id,
      doctor: appointment.doctor,
      amount: appointment.amount,
      stripePaymentIntentId: paymentIntent.id,
      status: 'completed',
      paymentMethod: paymentIntent.payment_method_types[0]
    });

    await payment.save();

    appointment.paymentStatus = 'paid';
    await appointment.save();

    res.json({
      message: 'Payment confirmed successfully',
      payment
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

    const payments = await Payment.find(query)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName')
      .populate('appointment', 'scheduledAt type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
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
    const payment = await Payment.findById(req.params.id)
      .populate('patient', 'user')
      .populate('patient.user', 'profile.firstName profile.lastName')
      .populate('doctor', 'specialization')
      .populate('doctor.user', 'profile.firstName profile.lastName')
      .populate('appointment', 'scheduledAt type');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || payment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || payment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/refund', auth, authorize('admin'), [
  body('payment').isMongoId(),
  body('amount').isFloat({ min: 0 }),
  body('reason').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = await Payment.findById(req.body.payment);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(req.body.amount * 100),
      reason: 'requested_by_customer',
      metadata: {
        refundReason: req.body.reason
      }
    });

    payment.status = 'refunded';
    payment.refundAmount = req.body.amount;
    payment.refundReason = req.body.reason;
    payment.refundId = refund.id;
    payment.refundedAt = new Date();

    await payment.save();

    const appointment = await Appointment.findById(payment.appointment);
    if (appointment) {
      appointment.paymentStatus = 'refunded';
      await appointment.save();
    }

    res.json({
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;