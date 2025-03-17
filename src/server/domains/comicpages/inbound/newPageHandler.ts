import { NextApiHandler } from "next";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { logger } from "@logger";
import { ErrorKeys } from "../errors.types";
import { ErrorKeys as CoreErrorKeys } from "../../errors.types";
import { createComicPage } from "../core/comicPageService";
import { acceptPostOnly } from "@domains/methodGatekeeper";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";
import { queueImageCompression } from "../outbound/comicPageCompressor";
import { sendErrorResponse } from "../../../errors";

const newPageHandler: NextApiHandler = async (req, res) => {
  acceptPostOnly(req, res);

  const { tenant } = req.query;
  if (!tenant) {
    return sendErrorResponse(ErrorKeys.COMIC_MISSING);
  }

  try {
    const comicID = await getComicIdFromSubdomain(tenant);

    const { imageUrl, authorComment, releaseOn, newPageNumber } = req.body;

    const information = {
      imageUrl,
      authorComment,
      releaseOn,
      newPageNumber,
      comicID,
    };

    const newPage = await createComicPage(information);

    if (newPage.success) {
      const { data } = newPage;

      try {
        await queueImageCompression({
          page_id: data.id,
          original_url: data.high_res_image_url,
          comic_id: comicID,
          page_number: data.page_number,
        });
      } catch (compressionError) {
        logger.error(compressionError);
      }

      return res.status(200).json(newPage);
    } else {
      logger.error(newPage.error);
      if (newPage.error === CoreErrorKeys.INVALID_REQUEST) {
        return sendErrorResponse(res, CoreErrorKeys.INVALID_REQUEST);
      } else {
        return sendErrorResponse(res, newPage.error);
      }
    }
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(res, CoreErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default withAuth(isAuthor(newPageHandler));
