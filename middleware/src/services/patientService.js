const express = require('express');
const axios = require('axios');
const { logger } = require('../index');

const router = express.Router();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

router.get('/:id', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/patients/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Patient details error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch patient details' });
  }
});

router.put('/:id/medical-history', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.put(`${BACKEND_URL}/api/patients/${req.params.id}/medical-history`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Patient medical history update error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to update medical history' });
  }
});

router.get('/:id/appointments', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/patients/${req.params.id}/appointointments`, {
      headers: { Authorization: `Bearer ${token}` },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Patient appointments error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch patient appointments' });
  }
});

router.get('/:id/medical-records', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/patients/${req.params.id}/medical-records`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Patient medical records error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch medical records' });
  }
});

module.exports = router;