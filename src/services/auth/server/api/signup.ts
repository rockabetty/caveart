import { NextApiHandler } from 'next';
import { hashPassword, hashEmail } from '../hash';
import { createUser } from '../../../../data/users';
import { encrypt } from '../encrypt';
import { createUserSessionCookie } from '../userSessionCookie';
import { ErrorKeys } from '../../types/errors'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const {password, name} = req.body;
    const sanitizedEmail = req.body.email.replace(/[^a-zA-Z0-9@._-]/gi, '');
    if (!name) {
      return res.status(400).send(ErrorKeys.USERNAME_MISSING);
    }
    if (!password) {
      return res.status(400).send(ErrorKeys.PASSWORD_MISSING);
    }
    if (!sanitizedEmail) {
      return res.status(400).send(ErrorKeys.EMAIL_INVALID);
    }
    const validUsername = /^[a-zA-Z0-9_-]+$/;
    if (!validUsername.test(name)) {
       return res.status(400).send(ErrorKeys.USERNAME_INVALID);
    }
    const encryptedEmail = encrypt(sanitizedEmail);
    const hashedEmail = await hashEmail(sanitizedEmail);
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(
      name,
      encryptedEmail,
      hashedEmail,
      hashedPassword,
    );
    const userId = newUser.rows[0].id;
    const userSessionCookie = await createUserSessionCookie(userId);
    res.setHeader('Set-Cookie', userSessionCookie);
    return res.status(200).send({ message: "Signup successful" });
  }
  catch (error) {
    if (error instanceof Error) {
      const customError = error as { code?: string, constraint?: string, message: string };

      const {code, constraint} = customError;
      if (code && code === '23505') {
        switch (constraint) {
          case 'users_username_key':
            return res.status(400).send(ErrorKeys.USERNAME_TAKEN)
          case 'users_email_key':
            return res.status(400).send(ErrorKeys.EMAIL_TAKEN)
          default:
            return res.status(400).send(ErrorKeys.GENERAL_SUBMISSION_ERROR)
        }
        return res.status(400).send(constraint)
      }
    }
    return res.status(500).send(error);
  }
}

export default handler;