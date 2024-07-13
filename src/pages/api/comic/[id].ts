import { NextApiHandler } from 'next';
import { getComic } from '../../../data/comics';
import { logger } from '../../../services/logs';

const handler: NextApiHandler = async (req, res) => {
  try {
    const {id} = req.query;
    if (typeof id === 'string' && parseInt(id)) {
      const idNumber = parseInt(id)
      const comicData = await getComic(idNumber);
      return res.status(200).send(comicData)
    } else {
      return res.status(400).send("Invalid comic ID");
    }
  }
  catch (error: any) {
    return res.status(500).send(error.message);
    logger.error(error);
  }
}

export default handler;