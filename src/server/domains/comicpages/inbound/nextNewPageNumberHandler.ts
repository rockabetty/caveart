import { NextApiHandler } from 'next';
import { ErrorKeys } from '../errors.types'
import { getNextNewPageNumber } from '../core/comicPageService';
import { acceptGetOnly } from "@domains/methodGatekeeper";

export const nextNewPageNumberHandler: NextApiHandler = async(
  req,
  res
) => {
  acceptGetOnly(req, res);

  const { comicId } = req.query;
  const idNum = Number(comicId)
  if (isNaN(idNum)) {
    res.status(400).end(ErrorKeys.COMIC_INVALID)
  }

  const result = await getNextNewPageNumber(idNum)
  if (result.success) {
    return res.status(200).send({ newPageNumber: result.number});
  }
  return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
}
