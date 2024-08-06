const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true,
    default: '', // Default value as an empty string
  },
  description: {
    type: String,
    default: '', // Default value as an empty string
  },
  quota: {
    type: Number,
    required: true,
    default: 0, // Default value as 0
  },
  waitlist: {
    type: Number,
    required: true,
    default: 0, // Default value as 0
  },
  enrollmentOpen: {
    type: Date,
    required: true,
    default: Date.now, // Default value as the current date and time
  },
  enrollmentClose: {
    type: Date,
    required: true,
    default: Date.now, // Default value as the current date and time
  },
  activityStartDate: {
    type: Date,
    required: true,
    default: Date.now, // Default value as the current date and time
  },
  activityEndDate: {
    type: Date,
    required: true,
    default: Date.now, // Default value as the current date and time
  },
  location: {
    type: String,
    default: '', // Default value as an empty string
  },
  locationLink: {
    type: String,
    default: '', // Default value as an empty string
  },
  fee: {
    type: String,
    default: '', // Default value as an empty string
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'], // Enumeration for difficulty levels
    required: true,
    default: 'easy', // Default value as 'easy'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: null, // Default value as null
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [], // Default value as an empty array
  }],
});

module.exports = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
