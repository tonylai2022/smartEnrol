import withAuthorization from '../../../utils/withAuthorization';

const handler = async (req, res) => {
  // Your admin route logic here
  res.status(200).json({ message: 'Admin content' });
};

export default withAuthorization('admin', handler);
