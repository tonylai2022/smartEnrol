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
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  activitiesJoined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    default: [],
  }],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
