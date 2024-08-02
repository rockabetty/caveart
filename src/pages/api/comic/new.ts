import { NextApiHandler } from 'next';
import newComicHandler, {config }from "@domains/comics/inbound/newComicHandler";

export { config };

const handler: NextApiHandler = (req, res) => {
  return newComicHandler(req, res);
};

export default handler;