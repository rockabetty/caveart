import {default as getRequestHandler} from "@domains/comics/inbound/comicProfileHandler";
import {default as putRequestHandler} from "@domains/comics/inbound/updateComicProfileHandler";

const handler: NextApiHandler = async (req, res): Promise<void> => {
  if (req.method == 'GET') {
  	getRequestHandler(req, res)
  }
  else if (req.method == 'PUT') {
  	putRequestHandler(req, res)
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;