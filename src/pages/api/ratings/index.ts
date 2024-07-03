import { NextApiHandler } from 'next';
import { getRatingDefs } from '../../../data/comics';

const handler: NextApiHandler = async (req, res) => {

  try {
    const ratings = await getRatingDefs(req.query.key);
    return res.status(200).send(ratings);
  } catch (error) {
    return res.status(500).send(error)
  }
}

export default handler;