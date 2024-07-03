import { NextApiHandler } from 'next';
import { extractUserIdFromToken } from  '../../../services/auth/server/extractUserIDFromToken';
import { getComic } from '../../../data/comics';
import { logger } from '../../../services/logs';

const handler: NextApiHandler = async (req, res) => {
  try {
    console.log(req.query)
    const {id} = req.query;
    const comicsData = await getComic(id);
    return res.status(200).send(comicsData);
  }
  catch (error: any) {
    logger.error(error);
    return res.status(500).send("Failed to fetch comic data");
  }
}

export default handler;