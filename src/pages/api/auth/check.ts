import { NextApiHandler } from 'next';
import { withAuth } from '../../../middleware/withAuth';

const handler: NextApiHandler = async (req, res) => {
  return res.status(200).json({ authenticated: true })
};

export default withAuth(handler);