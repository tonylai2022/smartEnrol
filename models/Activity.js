const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the ParticipantSchema as a subdocument schema
const ParticipantSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['enrolled', 'waitlisted'],
    required: true,
    default: 'enrolled',
  },
});

// Define the ActivitySchema
const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  quota: {
    type: Number,
    required: true,
    default: 0,
  },
  waitlist: {
    type: Number,
    required: true,
    default: 0,
  },
  enrollmentOpen: {
    type: Date,
    required: true,
    default: Date.now,
  },
  enrollmentClose: {
    type: Date,
    required: true,
    default: Date.now,
  },
  activityStartDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  activityEndDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  location: {
    type: String,
    default: '',
  },
  locationLink: {
    type: String,
    default: '',
  },
  fee: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    default: 'easy',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: null,
  },
  participants: {
    type: [ParticipantSchema], // Define participants as an array of ParticipantSchema
    default: [],
  },
});

module.exports = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
