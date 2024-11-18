import { NextApiHandler } from "next";
import { ErrorKeys } from "../errors.types";
import { getThumbnails } from "../core/comicPageService";
import { canEditComic } from "@domains/comics/core/comicService";
import { acceptGetOnly, getUnvalidatedToken } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { extractUserIdFromToken } from "@domains/users/utils/extractUserIdFromToken";

export const getComicPagesHandler: NextApiHandler = async (req, res) => {
  acceptGetOnly(req, res);

  const token = getUnvalidatedToken(req);
  const userID = await extractUserIdFromToken(token, false);
  const { tenant, limit, offset, chapter } = req.query;
  
  const comicID = await getComicIdFromSubdomain(tenant);
  let omniscient = false;
  if (!isNaN(userID)) {
    const permissions = await canEditComic(userID, comicID);
    omniscient = permissions.edit;
  }

  if (isNaN(comicID)) {
    res.status(400).end(ErrorKeys.COMIC_INVALID);
  }

  const result = await getThumbnails(comicID, offset, limit, chapter, omniscient);
  if (result.success) {
    return res.status(200).send({ pages: result.data });
  }
  return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
};

export default getComicPagesHandler;
