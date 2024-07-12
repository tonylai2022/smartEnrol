import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  activitiesJoined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
  }],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
