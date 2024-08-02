const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quota: {
    type: Number,
    required: true,
  },
  waitlist: {
    type: Number,
    required: true,
  },
  enrollmentOpen: {
    type: Date,
    required: true,
  },
  enrollmentClose: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  locationLink: {
    type: String,
  },
  fee: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

module.exports = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
