const express = require('express');
const axios = require('axios');
const { logger } = require('../index');

const router = express.Router();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

router.post('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.post(`${BACKEND_URL}/api/appointments`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.status(201).json(response.data);
  } catch (error) {
    logger.error('Appointment creation error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to create appointment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Appointments list error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch appointments' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/appointments/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Appointment details error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch appointment details' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.put(`${BACKEND_URL}/api/appointments/${req.params.id}/status`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Appointment status update error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to update appointment status' });
  }
});

router.get('/doctor/:doctorId/available-slots', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/appointments/doctor/${req.params.doctorId}/available-slots`, {
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Available slots error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch available slots' });
  }
});

module.exports = router;