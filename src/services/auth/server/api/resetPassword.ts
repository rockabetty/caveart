import { NextApiHandler } from 'next';
import { hashEmail, hashPassword } from '../hash';
import { getPasswordResetCredentials, editUser } from '../../../../data/users';
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

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send(ErrorKeys.EMAIL_INVALID);
    }
   
    const hashedEmail = hashEmail(email);
 
    const userCredentials = await getPasswordResetCredentials(
      'hashed_email',
      hashedEmail,
    );
    const {id, password_reset_token, password_reset_expiry} = userCredentials;
    if (!password_reset_expiry || !password_reset_token || !id) {
      throw new Error(ErrorKeys.CREDENTIALS_INVALID)
    }
    
    const storedResetToken = password_reset_token;
    const expirationTimestamp = password_reset_expiry;
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
    if (error instanceof Error) {
      logger.error(error); 
    }
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR)
  }
}

export default handler;