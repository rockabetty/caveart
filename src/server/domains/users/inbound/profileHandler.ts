import { NextApiHandler } from 'next';
import { requireEnvVar } from '../../../logs/envcheck'
import { withAuth } from '../withAuth';
import { ErrorKeys } from '../../types/errors';
import { getUserProfile } from '../core/userService';
import { withAuth } from '../middleware/withAuth';

const USER_AUTH_TOKEN_NAME = requireEnvVar('USER_AUTH_TOKEN_NAME');

const profileHandler: NextApiHandler = async (req, res) => {

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  if (!token) {
    return res.status(500).send(ErrorKeys.TOKEN_MISSING);
  }

  const result = await getUserProfile(token);

  if (result.success) {
    return res.status(200).send(result.data)
  } else {
    const badRequestKeys = [ErrorKeys.USER_INVALID, ErrorKeys.TOKEN_INVALID];
    if (badRequestKeys.includes(response.error)) {
      return res.status(404).json(response.error)
    }
    return res.satus(500).json(response.error)
  }
}

export default withAuth(profileHandler)