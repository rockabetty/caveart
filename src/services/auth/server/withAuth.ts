import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getUserSession } from '../../../data/users';
import { requireEnvVar } from '../../logs/envcheck';
import { USER_AUTH_TOKEN_NAME } from '../../../../constants';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

export const withAuth = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  
 if (!USER_AUTH_TOKEN_NAME) {
    return res.status(500).json({ error: 'Misconfiguration' });
  }

  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - no token' });
  }

  try {
    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT);

    const userSession = await getUserSession(token);
   
    // Ensure the sub is compared as a string
    if (!userSession || decodedRequestToken.sub?.toString() !== userSession.user_id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  return await fn(req, res);
};

export default withAuth;