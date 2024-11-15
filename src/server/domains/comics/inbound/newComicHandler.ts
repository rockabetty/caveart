import { NextApiHandler } from "next";
import { parseFormWithSingleImage } from "@server-services/uploader";
import { createComic } from "../core/comicService";
import { withAuth } from "@domains/users/middleware/withAuth";
import { logger } from "@logger";
import { ErrorKeys } from "../errors.types";
import { acceptPostOnly, getUnvalidatedToken } from "@domains/methodGatekeeper";
import { extractUserIdFromToken } from '@domains/users/utils/extractUserIdFromToken';

const handler: NextApiHandler = async (req, res): Promise<SubmissionResult> => {
  acceptPostOnly(req, res);
  try {
    const token = getUnvalidatedToken(req);
    const userID = await extractUserIdFromToken(token, false);
    if (isNaN(userID)) { 
      return res.status(403).json({ error: ErrorKeys.INVALID_REQUEST })
    }

    const {
      title,
      subdomain,
      rating,
      description,
      genres,
      content,
      comments,
      visibility,
      likes
    } = req.body

    const fields = {
      title,
      subdomain,
      rating,
      description,
      genres,
      content,
      comments,
      visibility,
      likes
    }

    console.log(req.body)
    
    const newComic = await createComic( fields, userID);

    console.log(newComic)
    if (newComic.success) {
      return res.status(200).json(newComic.data)
    } else {
      const statusCode = newComic.error === ErrorKeys.INVALID_REQUEST ? 400 : 500
      return res.status(statusCode).json({ error: newComic.error });
    }
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
}

export default withAuth(handler);
