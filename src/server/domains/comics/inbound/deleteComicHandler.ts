import { NextApiHandler } from "next";
import { deleteComic, getComicId } from "../core/comicService";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "../middleware/isAuthor";
import { logger } from "@logger";
import { ErrorKeys } from "../../../errors.types";
import { ErrorKeys as ComicErrorKeys } from "../errors.types";
import { extractUserIdFromToken } from '@domains/users/utils/extractUserIdFromToken';
import { acceptPostOnly, getUnvalidatedToken } from "@domains/methodGatekeeper";


const handler: NextApiHandler = async (req, res): Promise<void> => {
  acceptPostOnly(req, res);
  try {
    const token = getUnvalidatedToken(req);
    const userID = await extractUserIdFromToken(token, false);

    const {id, subdomain} = req.body;
    let comicID = id ? id : subdomain;
    if (comicID === subdomain) {
      const { data } = await getComicId(subdomain);
      comicID = data.id;
    }
    
    const deleteAttempt = await deleteComic(comicID, userID);
    if (deleteAttempt.success) {
      return res.status(200).send("OK");
    } else {
      return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR)
    }
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
};

export default withAuth(isAuthor(handler));