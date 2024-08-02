import { NextApiHandler } from 'next';
import updateDescriptionHandler from "@domains/comics/inbound/updateDescriptionHandler";

const handler: NextApiHandler = (req, res) => {
  return updateDescriptionHandler(req, res);
};

export default handler;