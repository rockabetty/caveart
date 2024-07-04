import { NextApiHandler } from 'next';
import { getRatingDefs } from '../../../data/comics';

const handler: NextApiHandler = async (req, res) => {

  const {key} = req.query;
  if (key === 'name' || key === 'id') {
    try {
      const ratings = await getRatingDefs(key);
      return res.status(200).send(ratings);
    } catch (error) {
      return res.status(500).send(error)
    }
  } else {
    return res.status(400).send(new Error());
  }
  
}

export default handler;