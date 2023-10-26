import { NextApiHandler } from "next"
import { encrypt } from '../../../auth/encrypt';
import { validateUserCredentials } from '../../../data/users';

const handler: NextApiHandler = async (req, res) => {
  try {
    const {password, username, email} = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).send("Required fields are missing.");
    }

    const hashedPassword = createHash(password);
    const identificationFormat = email
      ? 'email'
      : 'username'

    const identificationString = email
    ? .email.replace(/[^a-zA-Z0-9@._-]/gi, '');
    : username

    const authenticationData = await validateUserCredentials(
      identificationFormat,
      identificationString,
      hashedPassword
    );
  
  }
  catch (error) {
    res.status(500).send(err)
  }
}

export default handler;