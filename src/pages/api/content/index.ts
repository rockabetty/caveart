import { NextApiHandler } from 'next';
import { getNestedContentWarnings } from '../../../data/comics';
import { ContentWarningModel } from '../../../data/types/contentwarnings';



const handler: NextApiHandler = async (req, res) => {
  try {
    const content: ContentWarningModel[] = await getNestedContentWarnings();
    return res.status(200).send(content);
  } catch (error) {
    return res.status(500).send(error)
  }
}

export default handler;