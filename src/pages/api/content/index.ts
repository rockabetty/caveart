import { NextApiHandler } from 'next';
import { getContentWarningDefs } from '../../../data/comics';

const handler: NextApiHandler = async (_req, res) => {

  try {
    const content = await getContentWarningDefs();
    return res.status(200).send(content);
  } catch (error) {
    return res.status(500).send(error)
  }
}

export default handler;