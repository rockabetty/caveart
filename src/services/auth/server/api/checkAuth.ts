import { NextApiHandler } from 'next';
import { withAuth } from '../withAuth';

const handler: NextApiHandler = async (res) => {
  return res.status(200).json({ authenticated: true })
};

export default withAuth(handler);