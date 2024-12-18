import { NextApiRequest, NextApiResponse } from 'next';
import {default as getComicProfile} from "@domains/comics/inbound/comicProfileHandler";

export default async function comicProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getComicProfileHandler(req, res);
    // case 'PUT':
    //   return updateComicProfileHandler(req, res); 
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}