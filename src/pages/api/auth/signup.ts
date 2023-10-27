import { NextApiHandler } from 'next';
import { createHash, createRandom } from '../../../auth/server/hash';
import { createUser } from '../../../data/users';
import { encrypt } from '../../../auth/server/encrypt';

const handler: NextApiHandler = async (req, res) => {
  console.log("signup route hit")
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const {password, name} = req.body;
    const sanitizedEmail = req.body.email.replace(/[^a-zA-Z0-9@._-]/gi, '');

    if (!password || !name || !email) {
      return res.status(400).send("Required fields are missing.");
    }

    const validUsername = /^[a-zA-Z0-9_-]+$/;
    if (!validUsername.test(name)) {
      return res.status(400).send("Usernames can only be letters, numbers, dashes and underscores.")
    }

    const encryptedEmail = encrypt(sanitizedEmail);
    const hashedPassword = createHash(password);
    const newUser = await createUser(
      name,
      encryptedEmail,
      hashedPassword
    );
    res.status(200).send(newUser);
  }
  catch (error) {
    res.status(500).send(error);
  }
}

export default handler;

