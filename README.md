# Telemedicine AI App

A comprehensive telemedicine platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that connects patients with healthcare providers through AI-powered features.

## Features

### Core Features
- **User Authentication & Authorization**: Secure JWT-based authentication for patients, doctors, and admins
- **Doctor Management**: Complete doctor profiles with specialties, availability, and ratings
- **Patient Management**: Patient profiles with medical history and records
- **Appointment Booking**: Real-time scheduling with calendar integration
- **Video Consultations**: WebRTC-based video calling for remote consultations
- **AI Symptom Checker**: Intelligent symptom analysis and triage system
- **Prescription Management**: E-prescriptions with digital records
- **Medical Records**: Secure storage and management of medical documents
- **Payment Integration**: Stripe integration for consultation fees
- **Real-time Notifications**: Socket.io for instant updates

### AI Features
- **Symptom Analysis**: AI-powered symptom checker with condition probability assessment
- **Triage System**: Emergency level assessment and care setting recommendations
- **Doctor Recommendations**: AI-based doctor matching based on symptoms and specialization
- **Health Insights**: Personalized health recommendations and lifestyle suggestions

## Project Structure

```
telemedicine-app/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication and validation
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── server.js
├── middleware/             # API gateway and business logic
│   ├── src/
│   │   ├── services/      # Service layers
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration
│   └── package.json
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── styles/       # CSS and styling
│   ├── public/
│   └── package.json
└── README.md
```

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Socket.io**: Real-time communication
- **Stripe**: Payment processing
- **Twilio**: SMS and notifications
- **Bcryptjs**: Password hashing
- **Z-AI Web Dev SDK**: AI integration

### Middleware
- **Express.js**: API gateway
- **Redis**: Caching layer
- **Axios**: HTTP client
- **Winston**: Logging
- **Joi**: Data validation

### Frontend
- **React**: UI framework
- **Vite**: Build tool
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Zustand**: Client state management
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Socket.io Client**: Real-time features
- **React Hot Toast**: Notifications

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis (optional, for caching)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telemedicine-app
   ```

2. **Install dependencies for all components**
   ```bash
   # Backend
   cd backend
   npm install

   # Middleware
   cd ../middleware
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your configuration
   # Make sure to set all required variables
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Make sure MongoDB is running on default port 27017
   
   # Optional: Start Redis for caching
   # redis-server
   ```

5. **Run the Application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Middleware:**
   ```bash
   cd middleware
   npm run dev
   ```
   
   **Terminal 3 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Middleware API: http://localhost:3001
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Doctors
- `GET /api/doctors` - List doctors with filtering
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id/profile` - Update doctor profile
- `PUT /api/doctors/:id/status` - Update doctor status

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - List appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update appointment status

### AI Services
- `POST /api/ai/symptom-checker` - Analyze symptoms
- `POST /api/ai/triage` - Get triage assessment
- `POST /api/ai/doctor-recommendation` - Get doctor recommendations

## Key Features Implementation

### AI Symptom Checker
The AI symptom checker uses the Z-AI Web Dev SDK to provide intelligent health insights:

```javascript
// Example AI symptom analysis
const completion = await zai.chat.completions.create({
  messages: [
    {
      role: 'system',
      content: 'You are an AI medical assistant providing preliminary symptom analysis.'
    },
    {
      role: 'user',
      content: 'Analyze these symptoms: headache, fever, fatigue'
    }
  ]
});
```

### Real-time Communication
Socket.io enables real-time features:

```javascript
// Video call signaling
socket.emit('video-call', {
  roomId: appointment._id,
  signal: data.signal
});

// Chat messaging
socket.emit('chat-message', {
  roomId: consultation._id,
  message: messageData
});
```

### Secure Authentication
JWT-based authentication with role-based authorization:

```javascript
// Authentication middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
};
```

## Deployment

### Environment Variables for Production
- Set all environment variables in production
- Use strong JWT secrets
- Configure production database URLs
- Set up proper CORS origins

### Build Commands
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build

# Middleware
cd middleware
npm run build
```

## Security Considerations

1. **Authentication**: JWT tokens with proper expiration
2. **Authorization**: Role-based access control
3. **Data Validation**: Input sanitization and validation
4. **Rate Limiting**: API rate limiting to prevent abuse
5. **HTTPS**: SSL/TLS encryption in production
6. **Environment Variables**: Sensitive data in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This is a healthcare application and should be used in compliance with healthcare regulations such as HIPAA. Always consult with healthcare professionals for medical advice and treatment.