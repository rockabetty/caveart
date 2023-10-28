import { NextApiHandler } from 'next';
import { createHash, createRandom } from '../../../auth/server/hash';
import { createUser } from '../../../data/users';
import { encrypt } from '../../../auth/server/encrypt';
import { requireEnvVar } from '../../../errors/envcheck'
import { generateToken } from '../../../auth/server/jwt';
import { createUserSessionCookie } from '../../../auth/server/userSessionCookie';

const passwordRounds = Number(requireEnvVar('SALT_ROUNDS_PASSWORD'));
const emailRounds = Number(requireEnvVar('SALT_ROUNDS_EMAIL'));

const handler: NextApiHandler = async (req, res) => {
  console.log("signup route hit")
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const {password, name} = req.body;
    const sanitizedEmail = req.body.email.replace(/[^a-zA-Z0-9@._-]/gi, '');
   
    if (!password || !name || !sanitizedEmail) {
      return res.status(400).send("Required fields are missing.");
    }

    const validUsername = /^[a-zA-Z0-9_-]+$/;
    if (!validUsername.test(name)) {
       return res.status(400).send("Usernames can only be letters, numbers, dashes and underscores.")
    }
 
    const encryptedEmail = encrypt(sanitizedEmail);
    const hashedEmail = await createHash(sanitizedEmail, emailRounds);
    console.log(`Hashed email: ${hashedEmail}`);
    const hashedPassword = await createHash(password, passwordRounds);
    const newUser = await createUser(
      name,
      encryptedEmail,
      hashedEmail,
      hashedPassword,
    );

    const userId = newUser.rows[0].id;
    const userSessionCookie = await createUserSessionCookie(userId);
    res.setHeader('Set-Cookie', userSessionCookie);
    res.status(200).send();
    
  }
  catch (error) {
    res.status(500).send(error);
  }
}

export default handler;

