import { NextApiHandler } from 'next';
import comicProfileHandler from "@domains/comics/inbound/comicProfileHandler";

const handler: NextApiHandler = (req, res) => {
  return comicProfileHandler(req, res);
};

export default handler;