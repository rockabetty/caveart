import { NextApiHandler } from 'next';
import { logoutUser } from '../core/userService';
import { requireEnvVar } from '../../../services/logger/envcheck';
import { ErrorKeys } from '../errors.types';
import { withAuth } from '../middleware/withAuth';

const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");
const logoutHandler: NextApiHandler = async (req, res) => {
  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  if (!token) {
    return res.status(400).send(ErrorKeys.TOKEN_MISSING);
  }
  const result = await logoutUser(token);

  if (result.success) {
    res.setHeader('Set-Cookie', `${USER_AUTH_TOKEN_NAME}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    return res.status(200).send({ user: result.user });
  } else {
    return res.status(result.error === ErrorKeys.TOKEN_INVALID ? 401 : 500).send(result.error);
  }
};

export default withAuth(logoutHandler);