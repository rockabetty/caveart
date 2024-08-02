import { NextApiHandler } from 'next';
import updateGenresHandler from "@domains/comics/inbound/updateGenresHandler";

const handler: NextApiHandler = (req, res) => {
  return updateGenresHandler(req, res);
};

export default handler;