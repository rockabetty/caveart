import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getUserSession } from '../../../data/users';
import { requireEnvVar } from '../../logs/envcheck';
import { USER_AUTH_TOKEN_NAME } from '../../../../constants';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

export const withAuth = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  
 if (!USER_AUTH_TOKEN_NAME) {
    console.error('USER_AUTH_TOKEN_NAME is not configured');
    return res.status(500).json({ error: 'Misconfiguration' });
  }

  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  console.log('Token:', token);

  if (!token) {
    console.error('No token found in cookies');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT);
    console.log('Decoded token:', decodedRequestToken);

    const userSession = await getUserSession(token);
    console.log('User session:', userSession);

    // Ensure the sub is compared as a string
    if (!userSession || decodedRequestToken.sub.toString() !== userSession.user_id.toString()) {
      console.error('User session invalid or token subject does not match');
      return res.status(401).json({ error: 'Unauthorized' });
    }

  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }

  console.log("WithAuth is fine")

  return await fn(req, res);
};

export default withAuth;