import { getServerSession } from 'next-auth';
import dbConnect from '../../utils/dbConnect';
import Activity from '../../models/Activity';
import User from '../../models/User';
import { authOptions } from './auth/[...nextauth]';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    try {
        // Establish database connection
        await dbConnect();

        // Retrieve session using NextAuth
        const session = await getServerSession(req, res, authOptions);

        // Check if the session or userId is valid
        if (!session || !session.userId) {
            return res.status(401).json({ error: 'Not authenticated or user ID missing from session' });
        }

        // Ensure that the request method is POST
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // Extract and validate activityId from the request body
        const { activityId } = req.body;
        if (!activityId) {
            return res.status(400).json({ error: 'Activity ID is required' });
        }

        // Convert activityId to ObjectId and validate it
        if (!mongoose.Types.ObjectId.isValid(activityId)) {
            return res.status(400).json({ error: 'Invalid Activity ID format' });
        }
        const activityObjectId = new mongoose.Types.ObjectId(activityId);

        // Find the activity by ID
        const activity = await Activity.findById(activityObjectId);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Check if the user is already a participant
        if (activity.participants.some(participant => participant.user && participant.user.equals(session.userId))) {
            return res.status(400).json({ error: 'You have already joined this activity' });
        }

        // Check if the activity has spots left or if the user should be waitlisted
        const enrolledCount = activity.participants.filter(participant => participant.status === 'enrolled').length;
        const isFull = enrolledCount >= activity.quota;

        // Determine the participant's status
        const status = isFull ? 'waitlisted' : 'enrolled';

        // Add user to activity participants with status
        activity.participants.push({ user: session.userId, status });
        await activity.save();

        // Add activity to user's joined activities
        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.activitiesJoined.push(activityObjectId);
        await user.save();

        // Send success response
        res.status(200).json({ message: `Successfully joined activity as ${status}` });

    } catch (error) {
        console.error("Enroll Error:", error);
        res.status(500).json({ error: 'Failed to join activity', details: error.message });
    }
}
