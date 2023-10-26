import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getUserSession } from '../data/users';

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

const withAuth = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const tokenName = process.env.UNIQUE_AUTH_TOKEN_NAME;

  if (!tokenName) {
    return res.status(500).json({ error: 'Misconfiguration' });
  }

  const token = req.cookies[tokenName];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // TODO: add expiry, and if close to expiry but not expired, renew expiry

  try {
    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT);
    const userSession = await getUserSession(token);
    
    if (!userSession || decodedRequestToken.sub !== userSession['user_id']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  return await fn(req, res);
};

export default withAuth;