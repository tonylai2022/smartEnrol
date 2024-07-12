import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import withAuthorization from '../../../utils/withAuthorization';

dbConnect();

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { userId, role } = req.body;
      await User.findByIdAndUpdate(userId, { role });
      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user role' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default withAuthorization(['superadmin'], handler);
