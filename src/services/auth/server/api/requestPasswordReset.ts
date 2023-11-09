import { NextApiHandler } from 'next';
import { hashEmail, compareHash, createRandom } from '../hash';
import { decrypt } from '../encrypt';
import { getUserCredentials, editUser } from '../../../../data/users';
import { ErrorKeys } from '../../types/errors';
import { logger } from '../../../../logs';
import { sendSingleEmail } from '../../../emailer';


const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).send(ErrorKeys.EMAIL_MISSING);
    }

    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/gi, '');
    const hashedEmail = hashEmail(sanitizedEmail);
 
    const userCredentials = await getUserCredentials(
      'hashed_email',
      hashedEmail,
    );

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
    
    const resetAttempt = await editUser(id, update);
    const decryptedEmail = decrypt(email);
    const passwordResetEmail = await sendSingleEmail(
      decryptedEmail,
      'Password Reset',
      `
      <p>Hello!</p>
      <p>You are receiving this email because of an attempt to reset your password.</p>
      <p>
        <a href="https://www.caveartwebcomics.com/auth/password/${resetToken}>
          Click here to reset your password.
        </a>
        If you did not request this password reset then please ignore this email or contact us at ${requireEnvVar('SUPPORT_EMAIL_ADDRESS')} to report this email.
      </p>
      `
    )
    return res.status(200).send({ message: 'Password reset email sent.' });
  }
};
