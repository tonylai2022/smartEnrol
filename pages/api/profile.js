import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import Activity from '../../models/Activity';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.method === 'GET') {
    const createdActivities = await Activity.find({ createdBy: user._id });
    const joinedActivities = await Activity.find({ participants: user._id });

    return res.status(200).json({
      user,
      createdActivities,
      joinedActivities,
    });
  } else if (req.method === 'PUT') {
    const { name } = req.body;
    user.name = name;
    await user.save();

    return res.status(200).json(user);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
