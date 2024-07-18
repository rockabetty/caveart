import { NextApiHandler } from 'next';
import { ErrorKeys } from '../../types/errors';
import { logger } from '../../../logs';
import { resetPassword } from '../core/userService';
 
const restPasswordHandler: NextApiHandler = async (req, res) => {

  if (req.method !== 'POST') {
    return res.status(405).end();
  }
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
  const result = await resetPassword(newPassword, resetToken, email)
  if (result.success) {
    return res.status(200).send()
  } else {
     if (result.error) {
      return res.status(result.error === ErrorKeys.GENERAL_SERVER_ERROR ? 500 : 400).send(result.error)
     }
  }
  return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR)
}

export default restPasswordHandler;