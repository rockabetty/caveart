import { NextApiHandler } from 'next';
import { encrypt } from '../../../auth/server/encrypt';
import { generateToken } from '../../../auth/server/jwt';
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
      const userId = matchingUsers.rows[0].id;
      const {token, expirationDate} = generateToken(userId)

      const newUserSession = await createUserSession(
        userId,
        token,
        expirationDate
      );

      const tokenName = process.env.USER_AUTH_TOKEN_NAME;
      if (!tokenName) {
        throw new Error('Website misconfiguration')
      }

      res.setHeader('Set-Cookie', `${tokenName}=${token}; HttpOnly; Path=/;  Secure; SameSite=Lax; Expires=${expirationDate.toUTCString()};`);
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