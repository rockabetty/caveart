import { NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { requireEnvVar } from '../../../services/logs/envcheck'; 
import { withAuth } from '../../../services/auth/server/withAuth';
import { clearUserSession } from '../../../data/users';
import { USER_AUTH_TOKEN_NAME } from '../../../../constants';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

const handler: NextApiHandler = async (req, res) => {
  try {
    
    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
      return res.status(400).send({ error: 'Token not found' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY_JWT);
    } catch (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    const userId = decoded.sub;
    const sessionCleared = await clearUserSession(userId, token);
   
    if (!sessionCleared) {
      return res.status(401).send({ error: 'No session found for given token' });
    }
    
    res.setHeader('Set-Cookie', `${USER_AUTH_TOKEN_NAME}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);    
    res.status(200).send({ message: 'Logged out successfully' });

  } catch (error) {
    res.status(500).send({ error: 'Failed to log out' });
  }
}

export default withAuth(handler);