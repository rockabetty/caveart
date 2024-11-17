import { NextApiHandler } from 'next';
import { ErrorKeys } from '../errors.types'
import { getPages } from '../core/comicPageService';
import { acceptGetOnly } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";

export const nextNewPageNumberHandler: NextApiHandler = async(
  req,
  res
) => {
  acceptGetOnly(req, res);

  const { tenant } = req.query;
  const { limit, offset } = req.params;
  const comicID = await getComicIdFromSubdomain(tenant)
  if (isNaN(comicID)) {
    res.status(400).end(ErrorKeys.COMIC_INVALID)
  }

  const result = await getPages(comicID)
  if (result.success) {
    return res.status(200).send({ newPageNumber: result.number});
  }
  return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
}
