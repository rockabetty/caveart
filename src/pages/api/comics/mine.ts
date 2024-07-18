import { NextApiHandler } from 'next';
import { withAuth } from '../../../services/auth/server/withAuth';
import { extractUserIdFromToken } from  '../../../services/auth/server/extractUserIDFromToken';
import { getComicsByAuthor } from '@data/comics';
import { logger } from '../../../services/logs';

const handler: NextApiHandler = async (req, res) => {
  try {
    const userID = await extractUserIdFromToken(req, false);
    const comicsData = await getComicsByAuthor(parseInt(userID), ['id', 'title', 'subdomain']);
    return res.status(200).send(comicsData);
  }
  catch (error: any) {
    logger.error(error);
    return res.status(500).send("Failed to fetch comic data");
  }
}

export default withAuth(handler);