const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: {
      type: String,
      maxlength: 500
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  diagnosis: {
    type: String,
    required: true,
    maxlength: 1000
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  isDigital: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  pharmacy: {
    name: String,
    address: String,
    phone: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);