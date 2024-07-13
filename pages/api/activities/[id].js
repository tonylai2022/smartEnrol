import dbConnect from '../../../lib/mongodb';
import Activity from '../../../models/Activity';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activity', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
