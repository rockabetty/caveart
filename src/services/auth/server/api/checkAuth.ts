import { NextApiHandler } from 'next';
import { withAuth } from '../withAuth';

const handler: NextApiHandler = async (_req, res) => {
  console.log("Check auth running")
  return res.status(200).json({ authenticated: true })
};

export default withAuth(handler);