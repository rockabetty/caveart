import { NextApiHandler } from "next";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "../middleware/isAuthor";
import { logger } from "@logger";
import { updateGenres } from "../core/comicService";
import { ErrorKeys } from "../../../errors.types";
import { ErrorKeys as ComicErrorKeys } from "../errors.types";
import { acceptPostOnly } from "@domains/methodGatekeeper";

const updateGenresHandler: NextApiHandler = async (req, res): Promise<void> => {
  acceptPostOnly(req, res);
  try {
    const tenantID = Number(req.cookies['CAVEARTWBCMX_current-comic']);
    const { old, update } = req.body;

    const genreUpdate = await updateGenres(tenantID, old, update);
    if (genreUpdate.success) {
      return res.status(200).send("OK");
    }

    let statusCode = 400;
    if (genreUpdate.error === ErrorKeys.GENERAL_SERVER_ERROR) {
      logger.error(genreUpdate.error);
      statusCode = 500;
    }

    return res.status(statusCode).send(genreUpdate.error);
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
};

export default withAuth(updateGenresHandler);
