const express = require('express');
const axios = require('axios');
const { logger } = require('../index');

const router = express.Router();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

router.post('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.post(`${BACKEND_URL}/api/prescriptions`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.status(201).json(response.data);
  } catch (error) {
    logger.error('Prescription creation error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to create prescription' });
  }
});

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Prescriptions list error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch prescriptions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/prescriptions/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Prescription details error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch prescription details' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.put(`${BACKEND_URL}/api/prescriptions/${req.params.id}/status`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Prescription status update error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to update prescription status' });
  }
});

module.exports = router;