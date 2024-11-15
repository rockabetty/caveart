import { NextApiHandler } from "next";
import { parseFormWithSingleImage } from "@server-services/uploader";
import { updateThumbnail } from "../core/comicService";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "../middleware/isAuthor";
import { logger } from "@logger";
import { ErrorKeys } from "../errors.types";
import { acceptPostOnly } from "@domains/methodGatekeeper";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res): Promise<SubmissionResult> => {
  acceptPostOnly(req, res);
  try {
    const tenantID = Number(req.cookies['CAVEARTWBCMX_current-comic']);
    const { files, fields } = await parseFormWithSingleImage(req, 'thumbnail');
    const newThumbnail = await updateThumbnail(tenantID, files);
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
