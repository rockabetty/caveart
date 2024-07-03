import { NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getUser } from '../../../../data/users';
import { UserColumnsArray, User } from '../../../../data/types';
import { decrypt } from '../encrypt';
import { requireEnvVar } from '../../../logs/envcheck'
import { withAuth } from '../withAuth';
import { USER_AUTH_TOKEN_NAME } from '../../../../../constants';
import { ErrorKeys } from '../../types/errors';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

const handler: NextApiHandler = async (req, res) => {

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
      return res.status(500).send(ErrorKeys.TOKEN_MISSING);
    }

    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT) as { sub: string } | null;
    if (!decodedRequestToken) {
      return res.status(500).send(ErrorKeys.TOKEN_INVALID);
    }
    const userId = parseInt(decodedRequestToken.sub);

    if (!userId) {
      return res.status(403).json(ErrorKeys.USER_INVALID);
    }

    const userProfileDetails = [
      'username',
      'email',
      'role',
      'created_at'
    ] as UserColumnsArray;

    const userProfile: User | null = await getUser(userId, userProfileDetails);
    if (!userProfile) {
      return res.status(404).json(ErrorKeys.USER_INVALID);
    }

    const {email} = userProfile;
    const decryptedEmail = email && decrypt(email);
    userProfile.email = decryptedEmail;

    res.status(200).send(userProfile);
  } catch (error) {
    res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default withAuth(handler);