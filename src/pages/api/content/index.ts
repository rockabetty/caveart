import { NextApiHandler } from 'next';
import { getNestedContentWarnings } from '../../../data/comics';
import { NestedContentWarning } from '../../../data/types';


const handler: NextApiHandler = async (_req, res) => {
  try {
    const content: NestedContentWarning[] | null = await getNestedContentWarnings();
    if (content) {
      return res.status(200).send(content);
    }
    return res.status(500).send("No content warnings found")
  } catch (error) {
    return res.status(500).send(error)
  }
}

export default handler;