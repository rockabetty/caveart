import { NextApiHandler } from 'next';
import { loginUser } from '../core/userService';
import { ErrorKeys } from '../errors.types';

const loginHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(400).send(ErrorKeys.PASSWORD_MISSING);
    }
    if (!email) {
      return res.status(400).send(ErrorKeys.EMAIL_MISSING);
    }

    const result = await loginUser(email, password);

    if (result.success && result.sessionCookie) {
      res.setHeader('Set-Cookie', result.sessionCookie);
      return res.status(200).send({
        id: result.userId,
        user: result.username,
      });
    }

    return res.status(403).send({ error: ErrorKeys.CREDENTIALS_INVALID });
  } catch (error) {
    return res.status(500).send({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
};

export default loginHandler;