import { NextApiHandler } from "next";
import { ErrorKeys as CoreErrorKeys } from "../../../errors.types";
import { ErrorKeys } from "../errors.types";
import { sendErrorResponse } from "../../../errors";
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
    return sendErrorResponse(res, ErrorKeys.COMIC_INVALID);
  }

  const thumbnails = await getThumbnails(
    comicID,
    offset,
    limit,
    chapter,
    omniscient,
  );
  if (thumbnails.success) {
    return res.status(200).json({ pages: thumbnails.data });
  }
  console.log(thumbnails)
  return sendErrorResponse(res, CoreErrorKeys.GENERAL_SERVER_ERROR);
};

export default getComicPagesHandler;
