import { NextApiHandler } from 'next';
import { hashEmail, createRandom } from '../hash';
import { decrypt } from '../encrypt';
import { getUserCredentials, editUser } from '../../../../data/users';
import { ErrorKeys } from '../../types/errors';
import { logger } from '../../../logs';
import { sendSingleEmail } from '../../../emailer';
import { requireEnvVar } from '../../../logs/envcheck';
import { UserCredentials } from '../../../../data/types';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const requestEmail = req.body.email;

    if (!requestEmail) {
      return res.status(400).send(ErrorKeys.EMAIL_MISSING);
    }

    const sanitizedEmail = requestEmail.replace(/[^a-zA-Z0-9@._-]/gi, '');
    const hashedEmail = hashEmail(sanitizedEmail);
 
    const userCredentials: UserCredentials | null = await getUserCredentials(
      'hashed_email',
      hashedEmail,
    );

    if (!userCredentials) {
      // Don't want somebody to guess if an account exists or not, hence this misleading response
      return res.status(200).send({ message: 'Password reset email sent.' });
    }

    const {id, email} = userCredentials;

    if (!id || !email) {
      // For monitoring purposes we want to be aware of people trying to guess emails.
      logger.log(ErrorKeys.EMAIL_INVALID);
      // We want to prevent enumeration attacks, so we will pretend like all is well here.
      return res.status(200).send({ message: 'Password reset email sent.' });
    }
    
    const resetToken = await createRandom();
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + threeDaysInMilliseconds);

    const update = {
      password_reset_token: resetToken,
      password_reset_expiry: expirationDate
    };

    await editUser(id, update);
    const decryptedEmail = decrypt(email);
    await sendSingleEmail(
      decryptedEmail,
      'Password Reset',
      `
      <p>Hello!</p>
      <p>You are receiving this email because of an attempt to reset your password.</p>
      <p>
        <a href="https://www.caveartwebcomics.com/auth/password/${resetToken}">
          Click here to reset your password.
        </a>
        If you did not request this password reset then please ignore this email or contact us at ${requireEnvVar('SUPPORT_EMAIL_ADDRESS')} to report this email.
      </p>
      `
    );
    return res.status(200).send({ message: 'Password reset email sent.' });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error) 
    }
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default handler;
