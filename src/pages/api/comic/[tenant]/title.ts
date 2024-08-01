import { NextApiHandler } from 'next';
import updateTitleHandler, {config }from "@domains/comics/inbound/updateTitleHandler";

const handler: NextApiHandler = (req, res) => {
  return updateTitleHandler(req, res);
};

export default handler;