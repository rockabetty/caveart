import { NextApiHandler } from 'next';
import { ErrorKeys } from '../errors.types'
import { getLastPageNumber } from '../core/comicPageService';
import { acceptGetOnly } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";

export const lastPageNumberHandler: NextApiHandler = async(
  req,
  res
) => {
  acceptGetOnly(req, res);
  const { tenant } = req.query;
  const comicID = await getComicIdFromSubdomain(tenant)
  if (isNaN(comicID)) {
    res.status(400).end(ErrorKeys.COMIC_INVALID)
  }

  const result = await getLastPageNumber(comicID)
  if (result.success) {
    return res.status(200).send({ number: result.number});
  }
  return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
}



export default lastPageNumberHandler