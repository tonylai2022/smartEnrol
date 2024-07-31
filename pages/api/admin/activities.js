import { getSession } from 'next-auth/react';
import dbConnect from '../../../utils/dbConnect';
import Activity from '../../../models/Activity';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'You must be logged in to access this data.' });
  }

  await dbConnect();

  try {
    if (req.method === 'GET') {
      // Populate participants field with User data
      const activities = await Activity.find({})
        .populate('participants', 'name')
        .exec();
      return res.status(200).json(activities);
    }
    
    // Handle other methods like POST, PUT, DELETE as needed

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
