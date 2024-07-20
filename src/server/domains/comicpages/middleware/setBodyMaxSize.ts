import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

const setBodyMaxSize = (handler: NextApiHandler, size: string): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Override the default body size limit
    if (req.method === 'POST') {
      req.headers['content-length'] = size;
    }
    return handler(req, res);
  };
};

export default setBodyMaxSize;