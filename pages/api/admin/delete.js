import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../utils/dbConnect';
import Activity from '../../../models/Activity';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'DELETE') {
    const { activityId } = req.body;

    try {
      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      if (activity.createdBy.toString() !== session.userId && session.userRole !== 'superadmin') {
        return res.status(403).json({ error: 'Not authorized to delete this activity' });
      }

      await Activity.deleteOne({ _id: activityId });
      res.status(200).json({ message: 'Successfully deleted activity' });
    } catch (error) {
      console.error('Failed to delete activity:', error);
      res.status(500).json({ error: 'Failed to delete activity', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
