import { NextApiHandler } from 'next';
import { getFlatContentWarnings } from '../../../data/comics';

const handler: NextApiHandler = async (_req, res) => {
  try {
    const content = await getFlatContentWarnings();
    return res.status(200).send(content);
  } catch (error) {
    return res.status(500).send(error)
  }
}

export default handler;