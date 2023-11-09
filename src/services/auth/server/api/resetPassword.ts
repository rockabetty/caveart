import { NextApiHandler } from 'next';
import { hashEmail, hashPassword, compareHash } from '../hash';
import { getUserCredentials, editUser } from '../../../../data/users';
import { ErrorKeys } from '../../types/errors';
import { logger } from '../../../logs';
 
const handler: NextApiHandler = async (req, res) => {

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const {newPassword, resetToken, email} = req.body;
    if (!newPassword) {
      logger.log(ErrorKeys.PASSWORD_MISSING);
      return res.status(400).send(ErrorKeys.PASSWORD_MISSING);
    }
    if (!email) {
      logger.log(ErrorKeys.EMAIL_MISSING);
      return res.status(400).send(ErrorKeys.EMAIL_MISSING);
    }
    if (!resetToken) {
      logger.log(ErrorKeys.RESET_TOKEN_MISSING);
      return res.status(400).send(ErrorKeys.RESET_TOKEN_MISSING);
    }

    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/gi, '');
    const hashedEmail = hashEmail(sanitizedEmail);
 
    const userCredentials = await getUserCredentials(
      'hashed_email',
      hashedEmail,
    );

    const storedResetToken = userCredentials['password_reset_token'];
    const expirationTimestamp = userCredentials['password_reset_expiry'];
    const {id} = userCredentials;

    if (storedResetToken) {
      const isMatch = storedResetToken === resetToken;
      const expirationDate = new Date(expirationTimestamp);
      const currentDate = new Date(); 
      const isStillValid = currentDate < expirationDate;
      if (!isStillValid) {
        logger.log(ErrorKeys.RESET_TOKEN_EXPIRED);
        const removePasswordResetToken = {
          password_reset_token: null,
          password_reset_expiry: null
        };
        await editUser(id, removePasswordResetToken);
        return res.status(400).send(ErrorKeys.RESET_TOKEN_EXPIRED);
      }
      if (isMatch) {
        const password = await hashPassword(newPassword);
        const updatePassword = {
          password_reset_token: null,
          password_reset_expiry: null,
          password
        };
        await editUser(id, updatePassword);
        res.status(200).send({ message: 'Password reset succesfully.' });
      }
    }
    logger.log(ErrorKeys.CREDENTIALS_INVALID);
    return res.status(403).send(ErrorKeys.CREDENTIALS_INVALID);
  }
  catch (error) {
    logger.error(error);
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR)
  }
}

export default handler;