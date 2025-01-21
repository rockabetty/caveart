import { NextApiHandler } from "next";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "../middleware/isAuthor";
import { logger } from "@logger";
import { updateComicProfile } from "../core/comicService";
import { ErrorKeys } from "../../../errors.types";
import { acceptPutOnly } from "@domains/methodGatekeeper";

const handler: NextApiHandler = async (req, res): Promise<void> => {
  acceptPutOnly(req, res);
  try {
    const {update} = req.body;
    console.log("-@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(update)
    const {id} = update;

    const updateAttempt = await updateComicProfile(id, update);
    if (updateAttempt.success) {
      return res.status(200).send("OK");
    }

    let statusCode = 400;
    if (updateAttempt.error === ErrorKeys.GENERAL_SERVER_ERROR) {
      logger.error(updateAttempt.error);
      statusCode = 500;
    }
    return res.status(statusCode).send(updateAttempt.error);
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
};

export default withAuth(isAuthor(handler));