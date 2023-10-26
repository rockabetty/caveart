import { NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

const handler: NextApiHandler = async (req, res) => {
  try {
    const tokenName = process.env.UNIQUE_AUTH_TOKEN_NAME;
    if (!tokenName) {
      return res.status(500).send({ message: 'Authentication service unavailable' });
    }

    const token = req.cookies[tokenName];

    if (!token) {
      return res.status(400).send({ error: 'Token not found' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY_JWT);
    } catch (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    const userId = decoded.sub;
    const sessionCleared = await clearUserSession(userId, token);

    if (!sessionCleared) {
      return res.status(401).send({ error: 'No session found for given token' });
    }
    
    res.setHeader('Set-Cookie', `${tokenName}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);    
    res.status(200).send({ message: 'Logged out successfully' });

  } catch (error) {
    res.status(500).send({ error: 'Failed to log out' });
  }
}

export default handler;