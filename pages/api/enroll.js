import { getServerSession } from 'next-auth';
import dbConnect from '../../utils/dbConnect';
import Activity from '../../models/Activity';
import User from '../../models/User';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'POST') {
    const { activityId } = req.body;

    try {
      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      if (activity.participants.includes(session.userId)) {
        return res.status(400).json({ error: 'You have already joined this activity' });
      }

      activity.participants.push(session.userId);
      await activity.save();

      const user = await User.findById(session.userId);
      user.activitiesJoined.push(activityId);
      await user.save();

      res.status(200).json({ message: 'Successfully joined activity' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to join activity', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
