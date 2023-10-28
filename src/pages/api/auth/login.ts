import { NextApiHandler } from 'next';
import { encrypt } from '../../../auth/server/encrypt';
import { createUserSessionCookie } from '../../../auth/server/userSessionCookie';
import { getUsersWithMatchingAuthCredentials } from '../../../data/users';
 
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
    ? .email.replace(/[^a-zA-Z0-9@._-]/gi, '')
    : username

    const matchingUsers = await getUsersWithMatchingAuthCredentials(
      identificationFormat,
      identificationString,
      hashedPassword
    );

    if (matchingUsers.rows && matchingUsers.rows.length === 1 ) {
      const userId = Number(matchingUsers.rows[0].id);
      const userSessionCookie = await createUserSessionCookie(userId);
      res.setHeader('Set-Cookie', userSessionCookie);
      res.status(200).send('Authentication successful');
  } else {
      res.status(401).send('Invalid credentials');
    }
  }
  catch (error) {
    res.status(500).send(error)
  }
}

export default handler;