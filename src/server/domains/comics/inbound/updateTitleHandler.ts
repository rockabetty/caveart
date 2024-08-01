import { NextApiHandler } from "next";
import { canEditComic, updateTitle } from "../core/comicService";
import { withAuth } from "@domains/users/middleware/withAuth";
import { logger } from "@logger";
import { ErrorKeys } from "../../../errors.types";
import { ErrorKeys as ComicErrorKeys } from "../errors.types";
import { acceptPostOnly, getUnvalidatedToken } from "@domains/methodGatekeeper";
import { extractUserIdFromToken } from '@domains/users/utils/extractUserIdFromToken';

const handler: NextApiHandler = async (req, res): Promise<SubmissionResult> => {
  acceptPostOnly(req, res);
  try {
    const { tenant } = req.query;
    const token = getUnvalidatedToken(req);
    const userID = await extractUserIdFromToken(token, false);
    if (isNaN(userID)) { 
      return res.status(403).json({ error: ErrorKeys.INVALID_REQUEST })
    }

    const permissions = await canEditComic(token, tenant);
    if (!permissions.success) {
        return res.status(403).json({ error: ErrorKeys.USER_NOT_AUTHORIZED });
    }

    const { update } = req.body;
    if (typeof update !== "string") {
      return res.status(400).json({ error: ErrorKeys.INVALID_REQUEST  });
    }

    const newTitle = await updateTitle(tenant, update); 
    if (newTitle.success) {
      return res.status(200).send("OK");
    }

    let statusCode = 400;
    if (newTitle.error === ErrorKeys.GENERAL_SERVER_ERROR) {
      logger.error(error)
      statusCode = 500;
    }
    return res.status(statusCode).send(newTitle.error)
}

export default withAuth(handler);
