import { NextApiHandler } from 'next';
import { ErrorKeys } from '../errors.types'
import { getComicPage } from '../core/comicPageService';
import { acceptGetOnly } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";

export const getComicPageHandler: NextApiHandler = async(
  req,
  res
) => {
  acceptGetOnly(req, res);
  const {tenant} = req.query;
  const {number} = req.body;
  const comicID = await getComicPage(tenant)
  if (isNaN(comicID)) {
    res.status(400).end(ErrorKeys.COMIC_INVALID)
  }
  const result = await getComicPage(comicID)
  if (result.success) {
    return res.status(200).send({ number: result.number});
  }
  return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
}

export default getComicPageHandler