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
        const {
          name,
          description,
          quota,
          waitlist,
          enrollmentOpen,
          enrollmentClose,
          activityStartDate,
          activityEndDate,
          location,
          locationLink,
          fee,
          difficulty,
        } = req.body;

        // Debug: Log the received request body
        console.log('Received request body:', req.body);

        // Validation
        if (!name || quota == null || waitlist == null || !enrollmentOpen || !enrollmentClose || !activityStartDate || !activityEndDate || !difficulty) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate difficulty
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty)) {
          return res.status(400).json({ error: 'Invalid difficulty value' });
        }

        // Create new activity
        const newActivity = new Activity({
          name,
          description,
          quota: Number(quota),
          waitlist: Number(waitlist),
          enrollmentOpen: new Date(enrollmentOpen),
          enrollmentClose: new Date(enrollmentClose),
          activityStartDate: new Date(activityStartDate),
          activityEndDate: new Date(activityEndDate),
          location,
          locationLink,
          fee,
          difficulty,
          createdBy: session.user.id || session.userId,
        });

        // Debug: Log the new activity object before saving
        console.log('New activity to be saved:', newActivity);

        await newActivity.save();
        res.status(201).json(newActivity);
      } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;

    case 'GET':
      try {
        // Fetch activities and populate participants with user details
        const activities = await Activity.find({}).populate({
          path: 'participants.user',
          select: 'name', // Populate the user field with the user's name
        });
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
