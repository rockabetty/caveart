import { NextApiHandler } from 'next';
import { withAuth } from '@domains/users/middleware/withAuth';
import { extractUserIdFromToken } from  '@domains/users/utils/extractUserIdFromToken';
import { getComicsByAuthor } from '../outbound/comicRepository';
import { logger } from '@logger';
import { acceptGetOnly, getUnvalidatedToken } from "@domains/methodGatekeeper";

const userComicsHandler: NextApiHandler = async (req, res) => {
  acceptGetOnly(req, res)
  try {
    const token = getUnvalidatedToken(req);
    const userID = await extractUserIdFromToken(token);
    const comicsData = await getComicsByAuthor(Number(userID), ['id', 'title', 'subdomain']);
    return res.status(200).send(comicsData);
  }
  catch (error: any) {
    logger.error(error);
    return res.status(500).send("Failed to fetch comic data");
  }
}

export default withAuth(isAuthor(userComicsHandler));