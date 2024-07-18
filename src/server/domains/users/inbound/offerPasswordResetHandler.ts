import { NextApiHandler } from 'next';
import { offerPasswordReset } from '../core/userService';
import { ErrorKeys } from '../errors.types';

const offerPasswordResetHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const requestEmail = req.body.email;
  if (!requestEmail) {
    return res.status(400).send(ErrorKeys.EMAIL_MISSING);
  }
  const result = await offerPasswordReset(requestEmail)
  if (result.success) {
    return res.status(200).send({ message: 'Password reset email sent.' });
  } else {
    return res.status(500).send(result.error)
  }
};

export default offerPasswordResetHandler;
