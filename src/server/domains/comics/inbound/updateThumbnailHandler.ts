import { NextApiHandler } from "next";
import { updateThumbnail } from "../core/comicService";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "../middleware/isAuthor";
import { logger } from "@logger";
import { ErrorKeys } from "../errors.types";
import { acceptPostOnly } from "@domains/methodGatekeeper";


const handler: NextApiHandler = async (req, res): Promise<SubmissionResult> => {
  acceptPostOnly(req, res);
  try {
    const {tenant, uploadUrl} = req.body;
    
    if (!tenant) {
      return res.status(400).json({error: ErrorKeys.COMIC_ID_INVALID})
    }

    const newThumbnail = await updateThumbnail(tenant, uploadUrl);
    if (newThumbnail.success) {
      return res.status(200).json(newThumbnail.data)
    } else {
      const statusCode = newThumbnail.error === ErrorKeys.INVALID_REQUEST ? 400 : 500
      return res.status(statusCode).json({ error: newThumbnail.error });
    }
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
}

export default withAuth(isAuthor(handler));
