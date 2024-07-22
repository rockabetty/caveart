import { NextApiHandler } from "next";
import { getComicProfile } from "@domains/comics/core/comicService";
import { isValidSubdomain } from "@domains/comics/core/comicService";
import logger from "../../../../server/services/logger";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { comicId } = req.query;
    if (isValidSubdomain(comicId)) {
      const comicData = await getComicProfile(comicId);
      if (comicData.success) {
        return res.status(200).send(comicData.data);
      }
      return res.status(400).send(comicData.error);
    }
  } catch (error: any) {
    logger.error(error);
    return res.status(500).send(error.message);
  }
};

export default handler;
