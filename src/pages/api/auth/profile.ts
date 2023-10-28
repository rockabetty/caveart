import { NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getUser } from '../../../data/users';
import { requireEnvVar } from '../../../errors/envcheck'; 

const TOKEN_NAME = requireEnvVar('UNIQUE_AUTH_TOKEN_NAME');
const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

const handler: NextApiHandler = async (req, res) => {
  try {
    const token = req.cookies[TOKEN_NAME];
    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT);
    const userId = decodedRequestToken.sub;

    const userProfileDetails = [
      'username',
      'email',
      'role',
      'created_at'
    ];

    if (userId) {
      const userProfile = await getUser(userId, userProfileDetails);
      res.status.send(userProfile);
    }
    res.status(500).json({ error: 'Cannot identify user' });
  }
}

export default handler;