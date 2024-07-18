import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getUserSession } from '../outbound/userRepository';
import { requireEnvVar } from  '../../services/logs/envcheck';
import logger from '../../services/logger';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');
const USER_AUTH_TOKEN_NAME = requireEnvVar('USER_AUTH_TOKEN_NAME')

export const withAuth = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!USER_AUTH_TOKEN_NAME) {
      logger.error('Misconfiguration: USER_AUTH_TOKEN_NAME is not defined');
      return res.status(500).json({ error: 'Misconfiguration' });
    }

    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - no token' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY_JWT) as { sub: string };
      const userSession = await getUserSession(token);

      if (!userSession || decoded.sub?.toString() !== userSession.user_id.toString()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      req.user = { id: userSession.user_id };

      return handler(req, res);
    } catch (error) {
      logger.error('Invalid token', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

export default withAuth;