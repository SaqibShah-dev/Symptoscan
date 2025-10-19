const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalHistory: [{
    condition: String,
    diagnosis: String,
    treatment: String,
    date: Date,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }
  }],
  allergies: [{
    type: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    startDate: Date,
    endDate: Date
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);