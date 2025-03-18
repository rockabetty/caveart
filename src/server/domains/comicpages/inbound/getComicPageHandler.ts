import { NextApiHandler } from "next";
import { ErrorKeys } from "../errors.types";
import { ErrorKeys as CoreErrorKeys } from "../../../errors.types";
import { getComicPageByPageNumber, getPublishedComicPageByPageNumber } from "../core/comicPageService";
import { acceptGetOnly } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { sendErrorResponse } from "../../../errors";
import { canEditComic } from "@domains/comics/core/comicService";
import { getUnvalidatedToken } from '@domains/methodGatekeeper';
import { extractUserIdFromToken } from '@domains/users/utils/extractUserIdFromToken';

export const getComicPageHandler: NextApiHandler = async (req, res) => {
  acceptGetOnly(req, res);
  const { tenant, number } = req.query;
  const comicID = await getComicIdFromSubdomain(tenant);
  if (isNaN(comicID)) {
    return sendErrorResponse(res, ErrorKeys.COMIC_INVALID);
  }
  console.log(`Comic ID: ${comicID}`)
  const token = getUnvalidatedToken(req);
  if (!token) {
    return res.status(400).json({error: ErrorKeys.INVALID_REQUEST });
  }
  const userID = await extractUserIdFromToken(token, false);  
  const editPermissions =  await canEditComic(userID, tenant);

  const comicPage = editPermissions.edit
   ? await getPublishedComicPageByPageNumber(comicID, number)
   : await getComicPageByPageNumber(comicID, number);

  if (comicPage.success) {
    return res.status(200).send(comicPage.data);
  }
  return sendErrorResponse(res, CoreErrorKeys.GENERAL_SERVER_ERROR);
};
