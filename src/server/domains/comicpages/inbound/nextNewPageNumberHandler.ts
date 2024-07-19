import { NextApiHandler } from 'next';
import { ErrorKeys } from '../errors.types'
import { getNextNewPageNumber } from '../core/comicPageService';

export const nextNewPageNumberHandler: NextApiHandler = async(
  req,
  res
) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { comicId } = req.query;
  const idNum = Number(comicId)
  if (isNaN(idNum)) {
    res.status(400).end(ErrorKeys.COMIC_INVALID)
  }

  const result = await getNextNewPageNumber(idNum)
  console.log(result)
  if (result.success) {
    return res.status(200).send({ newPageNumber: result.number});
  }
  return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
}
