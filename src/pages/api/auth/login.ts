import { NextApiHandler } from "next"
import { createHash, createRandom } from '../../../auth/hash';
import { createUser } from '../../../data/users';

const handler: NextApiHandler = async (req, res) => {
  try {
    const {password, username} = req.body;
    const email = req.body.email.replace(/[^a-zA-Z0-9@._-]/gi, '');
    const hashedPassword = createHash(password);
    const hashedEmail = createHash(email);
    const newUser = await createUser(
      username,
      hashedEmail,
      hashedPassword
    );
    res.status(200).send(data);
  }
  catch (error) {
    res.status(500).send(err)
  }
}

export default handler;