import { NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { requireEnvVar } from '../../../logs/envcheck'
import { withAuth } from '../withAuth';
import { clearUserSession } from '../../../../data/users';
import { USER_AUTH_TOKEN_NAME } from '../../../../../constants';
import { ErrorKeys } from '../../types/errors';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

const handler: NextApiHandler = async (req, res) => {
  try {
    
    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
      return res.status(400).send(ErrorKeys.TOKEN_MISSING);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY_JWT);
    } catch (err) {
      return res.status(401).send(ErrorKeys.TOKEN_INVALID);
    }

    const userId = decoded.sub;
    const sessionCleared = await clearUserSession(userId, token);
   
    if (!sessionCleared) {
      return res.status(401).send(ErrorKeys.SESSION_MISSING);
    }
    
    res.setHeader('Set-Cookie', `${USER_AUTH_TOKEN_NAME}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);    
    return res.status(200).send();

  } catch (error) {
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
}

export default withAuth(handler);