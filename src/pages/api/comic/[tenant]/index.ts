import {default as getRequestHandler} from "@domains/comics/inbound/comicProfileHandler";
import {default as putRequestHandler} from "@domains/comics/inbound/updateComicProfileHandler";

const handler: NextApiHandler = async (req, res): Promise<void> => {
  if (req.method === 'GET') {
  	getRequestHandler(req, res)
  }
  if (req.method === 'PUT') {
  	putRequestHandler(req, res)
  }
};

export default handler;