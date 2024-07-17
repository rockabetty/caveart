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
    const {password, name, email} = req.body;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send(ErrorKeys.EMAIL_INVALID);
    }
    if (!name) {
      return res.status(400).send(ErrorKeys.USERNAME_MISSING);
    }
    if (!password) {
      return res.status(400).send(ErrorKeys.PASSWORD_MISSING);
    }
    
    const validUsername = /^[a-zA-Z0-9_-]+$/;
    if (!validUsername.test(name)) {
       return res.status(400).send(ErrorKeys.USERNAME_INVALID);
    }
    const encryptedEmail = encrypt(email);
    const hashedEmail = await hashEmail(email);
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(
      name,
      encryptedEmail,
      hashedEmail,
      hashedPassword,
    );

    if (newUser) {
      return res.status(200).send({ message: "Signup successful" });
    }
  }
  catch (error:any) {
    if (error.name === 'ClientError') {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).send(error);
  }
}

export default handler;