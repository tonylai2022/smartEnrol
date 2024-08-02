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
        const { name, description, quota, waitlist, enrollmentOpen, enrollmentClose } = req.body;

        // Validation
        if (!name || !description || quota == null || waitlist == null || !enrollmentOpen || !enrollmentClose) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure quota and waitlist are numbers
        const quotaNumber = Number(quota);
        const waitlistNumber = Number(waitlist);

        if (isNaN(quotaNumber) || isNaN(waitlistNumber)) {
          return res.status(400).json({ error: 'Quota and waitlist must be valid numbers' });
        }

        const enrollmentOpenDate = new Date(enrollmentOpen);
        const enrollmentCloseDate = new Date(enrollmentClose);

        if (isNaN(enrollmentOpenDate.getTime()) || isNaN(enrollmentCloseDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date format for enrollment period.' });
        }

        const userId = session.user?.id || session.userId;
        if (!userId) {
          return res.status(400).json({ error: 'User ID is missing in session' });
        }

        // Create new activity
        const newActivity = new Activity({
          name,
          description,
          quota: quotaNumber,
          waitlist: waitlistNumber,
          enrollmentOpen: enrollmentOpenDate,
          enrollmentClose: enrollmentCloseDate,
          createdBy: userId,
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
