import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

const withAuth = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const tokenName = process.env.UNIQUE_AUTH_TOKEN_NAME;

  if (!tokenName) {
    throw new Error('Misconfiguration');
  }

  const token = req.cookies[tokenName];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY_JWT);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  return await fn(req, res);
};

export default withAuth;