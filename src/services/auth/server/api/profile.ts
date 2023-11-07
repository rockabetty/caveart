import { NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getUser } from '../../../../data/users';
import { decrypt } from '../encrypt';
import { requireEnvVar } from '../../../logs/envcheck'
import { withAuth } from '../withAuth';
import { USER_AUTH_TOKEN_NAME } from '../../../../../constants';
import { ErrorKeys } from '../../types/errors';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

const handler: NextApiHandler = async (req, res) => {
  try {
    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT);
    const userId = decodedRequestToken.sub;
    const userProfileDetails = [
      'username',
      'email',
      'role',
      'created_at'
    ];

    if (!userId) {
      return res.status(403).json(ErrorKeys.USER_INVALID);
    }

    const userProfile = await getUser(userId, userProfileDetails);
    if (!userProfile) {
      return res.status(404).json(ErrorKeys.USER_INVALID);
    }

    const {email} = userProfile;
    const decryptedEmail = decrypt(email);
    userProfile.email = decryptedEmail;

    const date = new Date(userProfile['created_at']);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    userProfile['created_at'] = `${month}/${day}/${year}`;

    res.status(200).send(userProfile);
  } catch (error) {
    res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default withAuth(handler);