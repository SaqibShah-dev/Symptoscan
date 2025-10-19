const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const redis = require('redis');
const { createClient } = redis;
const axios = require('axios');
const Joi = require('joi');
const winston = require('winston');

dotenv.config();

const app = express();
const PORT = process.env.MIDDLEWARE_PORT || 3001;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'telemedicine-middleware' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});

let redisClient;
if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', (err) => logger.error('Redis Client Error', err));
  redisClient.connect();
}

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    if (!redisClient) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      next();
    } catch (error) {
      logger.error('Cache error:', error);
      next();
    }
  };
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    req.user = response.data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

app.use('/api/auth', require('./services/authService'));
app.use('/api/doctors', require('./services/doctorService'));
app.use('/api/patients', require('./services/patientService'));
app.use('/api/appointments', require('./services/appointmentService'));
app.use('/api/consultations', require('./services/consultationService'));
app.use('/api/prescriptions', require('./services/prescriptionService'));
app.use('/api/medical-records', require('./services/medicalRecordService'));
app.use('/api/payments', require('./services/paymentService'));
app.use('/api/ai', require('./services/aiService'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'middleware',
    timestamp: new Date().toISOString(),
    redis: redisClient ? 'connected' : 'disconnected'
  });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  logger.info(`Middleware server running on port ${PORT}`);
});

module.exports = { app, logger, redisClient };