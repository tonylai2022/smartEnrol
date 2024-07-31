// pages/api/unenroll.js

import { getServerSession } from 'next-auth';
import dbConnect from '../../utils/dbConnect';
import Activity from '../../models/Activity';
import User from '../../models/User';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    await dbConnect();
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.method === 'POST') {
      const { activityId } = req.body;

      try {
        const activity = await Activity.findById(activityId);
        if (!activity) {
          return res.status(404).json({ error: 'Activity not found' });
        }

        if (!Array.isArray(activity.participants)) {
          return res.status(400).json({ error: 'Participants list is not an array' });
        }

        const participantIndex = activity.participants.indexOf(session.userId);
        if (participantIndex === -1) {
          return res.status(400).json({ error: 'You are not enrolled in this activity' });
        }

        // Remove the user from the activity's participants
        activity.participants.splice(participantIndex, 1);
        await activity.save();

        // Remove the activity from the user's joined activities
        const user = await User.findById(session.userId);
        if (!user || !Array.isArray(user.activitiesJoined)) {
          return res.status(404).json({ error: 'User not found or activitiesJoined list is not an array' });
        }

        const activityIndex = user.activitiesJoined.indexOf(activityId);
        if (activityIndex > -1) {
          user.activitiesJoined.splice(activityIndex, 1);
          await user.save();
        }

        res.status(200).json({ message: 'Successfully unenrolled from activity' });
      } catch (error) {
        console.error('Unenroll error:', error);
        res.status(500).json({ error: 'Failed to unenroll from activity', details: error.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
