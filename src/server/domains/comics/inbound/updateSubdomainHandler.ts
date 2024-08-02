import { NextApiHandler } from "next";
import { canEditComic, updateSubdomain } from "../core/comicService";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "../middleware/isAuthor";
import { logger } from "@logger";
import { ErrorKeys } from "../../../errors.types";
import { ErrorKeys as ComicErrorKeys } from "../errors.types";
import { acceptPostOnly } from "@domains/methodGatekeeper";

const handler: NextApiHandler = async (req, res): Promise<void> => {
  acceptPostOnly(req, res);
  try {
    const tenantID = Number(req.cookies['CAVEARTWBCMX_current-comic']);
    const { update } = req.body;

    if (typeof update !== "string") {
      return res.status(400).json({ error: ErrorKeys.INVALID_REQUEST });
    }

    const newSubdomain = await updateSubdomain(tenantID, update);
    if (newSubdomain.success) {
      return res.status(200).send("OK");
    }

    let statusCode = 400;
    if (newTitle.error === ErrorKeys.GENERAL_SERVER_ERROR) {
      logger.error(newSubdomain.error);
      statusCode = 500;
    }

    return res.status(statusCode).send(newSubdomain.error);
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
};

export default withAuth(isAuthor(handler));