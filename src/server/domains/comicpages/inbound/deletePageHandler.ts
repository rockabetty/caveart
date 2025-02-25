import { NextApiHandler } from "next";
import { canEditComic } from "@domains/comics/core/comicService";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { logger } from "@logger";
import { ErrorKeys as CoreErrorKeys } from "../../errors.types";
import { ErrorKeys } from "../errors.types";
import { sendErrorResponse } from "../../../errors";
import { deleteComicPage } from "../core/comicPageService";
import { requireEnvVar } from "@logger/envcheck";
const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");

import {
  acceptPostOnly,
  requireButDoNotValidateToken,
} from "@domains/methodGatekeeper";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";

const deletePageHandler: NextApiHandler = async (req, res) => {
  acceptPostOnly(req, res);

  const { tenant, page_number } = req.query;
  if (!tenant) {
    return sendErrorResponse(ErrorKeys.COMIC_MISSING);
  }
  if (!page_number) {
    return sendErrorResponse(ErrorKeys.COMIC_PAGE_MISSING);
  }

  try {
    const deletionAttempt = await deleteComicPage(page_number, tenant);
    if (deletionAttempt.success) {
      return res.status(200).json(deletionAttempt);
    } else {
      logger.error(deletionAttempt.error);
      if (deletionAttempt.error === CoreErrorKeys.INVALID_REQUEST) {
        return sendErrorResponse(CoreErrorKeys.INVALID_REQUEST)
      } else {
        return sendErrorResponse(deletionAttempt.error);
      }
    }
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(CoreErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default withAuth(isAuthor(deletePageHandler));
