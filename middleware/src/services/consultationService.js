const express = require('express');
const axios = require('axios');
const { logger } = require('../index');

const router = express.Router();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

router.post('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.post(`${BACKEND_URL}/api/consultations`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.status(201).json(response.data);
  } catch (error) {
    logger.error('Consultation creation error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to create consultation' });
  }
});

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/consultations`, {
      headers: { Authorization: `Bearer ${token}` },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Consultations list error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch consultations' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.get(`${BACKEND_URL}/api/consultations/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Consultation details error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch consultation details' });
  }
});

router.put('/:id/end', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.put(`${BACKEND_URL}/api/consultations/${req.params.id}/end`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Consultation end error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to end consultation' });
  }
});

router.put('/:id/rating', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.put(`${BACKEND_URL}/api/consultations/${req.params.id}/rating`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Consultation rating error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to rate consultation' });
  }
});

module.exports = router;