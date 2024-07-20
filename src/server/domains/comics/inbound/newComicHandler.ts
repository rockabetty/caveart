import { NextApiRequest } from "next";
import { parseFormWithSingleImage } from "@services/uploader";
import { createComic } from "../core/comicService";
import { withAuth } from "@domains/users/middleware/withAuth";
import { logger } from "@logger";
import { ErrorKeys } from "../errors.types";
import { acceptPostOnly, requireButDoNotValidateToken } from "@domains/methodGatekeeper";
import { parseFormWithSingleImage } from "@services/uploader";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readForm = (req: NextApiRequest): Promise<SubmissionResult> => {

  acceptPostOnly(req, res);
  requireButDoNotValidateToken(req, res);

   try {
    const { files, fields } = await parseFormWithSingleImage(req, 'thumbnail');
    const newComic = await createComic(fields, files);
    if (newComic.success) {
      return res.status(200).json(newComic.data)
    } else {
      const statusCode = newComic.error === ErrorKeys.GENERAL_SERVER_ERROR ? 500 : 400
      return res.status(statusCode).json({ error: newComic.error });
    }
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
}

export default withAuth(handler);
