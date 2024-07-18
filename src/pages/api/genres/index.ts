import { NextApiHandler } from 'next';
import { getGenres } from '@data/comics';

const handler: NextApiHandler = async (_req, res) => {
  try {
    const data = await getGenres();
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error)
  }
}

export default handler;