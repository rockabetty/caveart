import { NextApiHandler } from 'next';
import { hashEmail, compareHash } from '../hash';
import { createUserSessionCookie } from '../userSessionCookie';
import { getUserCredentials } from '../../../../data/users';
import { ErrorKeys } from '../../types/errors';
 
const handler: NextApiHandler = async (req, res) => {
  try {
    const {password, email} = req.body;
    if (!password) {
      return res.status(400).send(ErrorKeys.PASSWORD_MISSING);
    }
    if (!email) {
      return res.status(400).send(ErrorKeys.EMAIL_MISSING);
    }

    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/gi, '');
    const hashedEmail = hashEmail(sanitizedEmail);
 
    const userCredentials = await getUserCredentials(
      'hashed_email',
      hashedEmail,
    );

    const storedPassword = userCredentials.password;

    if (storedPassword) {
      const isMatch = await compareHash(password, storedPassword);

      if (isMatch) {
        const sessionCookie = await createUserSessionCookie(userCredentials.id);
        res.setHeader('Set-Cookie', sessionCookie);
        res.status(200).send({ user: userCredentials.username });
      }
    }
    return res.status(403).send(ErrorKeys.CREDENTIALS_INVALID);
  }
  catch (error) {
    return res.status(500).send(error)
  }
}

export default handler;