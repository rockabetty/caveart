import { NextApiHandler } from 'next';
import { hashEmail, compareHash } from '../hash';
import { createUserSessionCookie } from '../userSessionCookie';
import { getUserCredentials } from '../../../../data/users';
 
const handler: NextApiHandler = async (req, res) => {
  try {
    const {password, email} = req.body;
    if (!password || !email) {
      res.status(400).send("Required fields are missing.");
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
    res.status(400).send('Credentials not valid');
  }
  catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
}

export default handler;