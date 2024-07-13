import dbConnect from '../../../lib/mongodb';
import Activity from '../../../models/Activity';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect(); // Ensure database connection

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.method === 'GET') {
    try {
      const activities = await Activity.find({ createdBy: user._id }).populate('participants', 'name email');
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
