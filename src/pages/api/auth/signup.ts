import { NextApiHandler } from 'next';
import { createHash, createRandom } from '../../../auth/hash';
import { createUser } from '../../../data/users';
import { encrypt } from '../../../encrypt';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const {password, username} = req.body;
    const sanitizedEmail = req.body.email.replace(/[^a-zA-Z0-9@._-]/gi, '');

    if (!password || !username || !email) {
      return res.status(400).send("Required fields are missing.");
    }

    const encryptedEmail = encrypt(sanitizedEmail);
    const hashedPassword = createHash(password);
    const newUser = await createUser(
      username,
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

