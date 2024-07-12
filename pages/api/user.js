import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import { getSession } from 'next-auth/react';

dbConnect();

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'PUT') {
    try {
      const { name, email } = req.body;
      await User.findByIdAndUpdate(session.userId, { name, email });
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
