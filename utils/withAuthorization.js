import { getSession } from 'next-auth/react';

const withAuthorization = (roles, handler) => {
  return async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(session.userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return handler(req, res);
  };
};

export default withAuthorization;
