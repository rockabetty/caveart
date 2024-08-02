import { NextApiHandler } from 'next';
import updateSubdomainHandler, {config }from "@domains/comics/inbound/updateSubdomainHandler";

const handler: NextApiHandler = (req, res) => {
  return updateSubdomainHandler(req, res);
};

export default handler;