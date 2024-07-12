import dbConnect from '../../../utils/dbConnect';
import Activity from '../../../models/Activity';
import { getSession } from 'next-auth/react';

dbConnect();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'GET') {
    try {
      const activities = await Activity.find({});
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { name, description } = req.body;

    try {
      const activity = await Activity.create({
        name,
        description,
        createdBy: session.user.id,
      });
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create activity', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
