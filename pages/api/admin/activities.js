import dbConnect from '../../../utils/dbConnect';
import Activity from '../../../models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  switch (req.method) {
    case 'POST':
      try {
        const { name, description, quota, waitlist, enrollmentOpen, enrollmentClose, location, locationLink, fee } = req.body;

        // Validation
        if (!name || !description || quota == null || waitlist == null || !enrollmentOpen || !enrollmentClose) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create new activity
        const newActivity = new Activity({
          name,
          description,
          quota: Number(quota),
          waitlist: Number(waitlist),
          enrollmentOpen: new Date(enrollmentOpen),
          enrollmentClose: new Date(enrollmentClose),
          location: location || '',
          locationLink: locationLink || '',
          fee: fee || '',
          createdBy: session.user.id || session.userId,
        });

        await newActivity.save();
        res.status(201).json(newActivity);
      } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;

    case 'GET':
      try {
        const activities = await Activity.find({});
        res.status(200).json(activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
}
