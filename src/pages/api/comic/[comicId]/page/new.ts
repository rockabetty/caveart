import { NextApiHandler } from 'next';
import newPageHandler, {config }from "@domains/comicpages/inbound/newPageHandler";

export { config };

const handler: NextApiHandler = (req, res) => {
  return newPageHandler(req, res);
};

export default handler;