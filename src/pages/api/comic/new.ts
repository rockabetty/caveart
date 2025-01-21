import { NextApiHandler } from 'next';
import newComicHandler, from "@domains/comics/inbound/newComicHandler";

const handler: NextApiHandler = (req, res) => {
  return newComicHandler(req, res);
};

export default handler;