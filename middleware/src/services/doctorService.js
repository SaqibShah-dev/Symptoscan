const express = require('express');
const axios = require('axios');
const { logger, redisClient } = require('../index');

const router = express.Router();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const CACHE_DURATION = 300; // 5 minutes

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, specialization, search, minRating, availableOnly } = req.query;
    const cacheKey = `doctors:${JSON.stringify(req.query)}`;

    if (redisClient) {
      try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return res.json(JSON.parse(cachedData));
        }
      } catch (cacheError) {
        logger.error('Redis cache error:', cacheError);
      }
    }

    const response = await axios.get(`${BACKEND_URL}/api/doctors`, { params: req.query });
    
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(response.data));
      } catch (cacheError) {
        logger.error('Redis cache set error:', cacheError);
      }
    }

    res.json(response.data);
  } catch (error) {
    logger.error('Doctors list error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch doctors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cacheKey = `doctor:${req.params.id}`;

    if (redisClient) {
      try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return res.json(JSON.parse(cachedData));
        }
      } catch (cacheError) {
        logger.error('Redis cache error:', cacheError);
      }
    }

    const response = await axios.get(`${BACKEND_URL}/api/doctors/${req.params.id}`);
    
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(response.data));
      } catch (cacheError) {
        logger.error('Redis cache set error:', cacheError);
      }
    }

    res.json(response.data);
  } catch (error) {
    logger.error('Doctor details error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch doctor details' });
  }
});

router.get('/specializations/list', async (req, res) => {
  try {
    const cacheKey = 'doctor-specializations';

    if (redisClient) {
      try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return res.json(JSON.parse(cachedData));
        }
      } catch (cacheError) {
        logger.error('Redis cache error:', cacheError);
      }
    }

    const response = await axios.get(`${BACKEND_URL}/api/doctors/specializations/list`);
    
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, CACHE_DURATION * 10, JSON.stringify(response.data));
      } catch (cacheError) {
        logger.error('Redis cache set error:', cacheError);
      }
    }

    res.json(response.data);
  } catch (error) {
    logger.error('Doctor specializations error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch specializations' });
  }
});

router.post('/:id/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.post(`${BACKEND_URL}/api/doctors/${req.params.id}/profile`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (redisClient) {
      try {
        await redisClient.del(`doctor:${req.params.id}`);
        await redisClient.del('doctors:*');
      } catch (cacheError) {
        logger.error('Redis cache invalidation error:', cacheError);
      }
    }

    res.json(response.data);
  } catch (error) {
    logger.error('Doctor profile update error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to update doctor profile' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const response = await axios.put(`${BACKEND_URL}/api/doctors/${req.params.id}/status`, req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (redisClient) {
      try {
        await redisClient.del(`doctor:${req.params.id}`);
        await redisClient.del('doctors:*');
      } catch (cacheError) {
        logger.error('Redis cache invalidation error:', cacheError);
      }
    }

    res.json(response.data);
  } catch (error) {
    logger.error('Doctor status update error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to update doctor status' });
  }
});

module.exports = router;