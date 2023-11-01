/**
 * Checks a JWT from request headers and returns an ID based on decoding the sub.
 * 
 * This function optionally checks a token for validity, in case it needs to be 
 * called within an endpoint that is already checking for validity but needs to
 * know the actual user ID number for other purposes like passing user_id to bridge
 * tables.  The default assumption is to validate the token. 
 * 
 * @param {NextApiRequest} req - The request from which headers will be read
 * @param {boolean} validateSession - Whether to validate the session, default true
 * @returns {string} A string containing the user ID, derived from the JWT's sub.
 * @throws Throws an error if decoding the token, getting user session, or any other operation fails.
 *
 */
import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { getUserSession } from '../../data/users';
import { requireEnvVar} from '../../errors/envcheck';
import { USER_AUTH_TOKEN_NAME } from '../../../constants';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

export async function extractUserIdFromToken (req: NextApiRequest, validateSession: boolean = true): Promise<string> {
  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT);
  if (validateSession) {
    const userSession = await getUserSession(token);
    if (!userSession || decodedRequestToken.sub !== userSession['user_id']) {
      throw new Error("Invalid user session");
    }
  }
  return decodedRequestToken.sub
}

export default extractUserIdFromToken;