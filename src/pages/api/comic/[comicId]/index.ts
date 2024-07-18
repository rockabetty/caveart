import { NextApiHandler } from "next";
import { getComic } from "@data/comics";
import logger from "../../../../server/services/logger";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { comicId } = req.query;
    if (typeof comicId === "string" && parseInt(comicId)) {
      const idNumber = parseInt(comicId);
      const comicData = await getComic(idNumber);
      return res.status(200).send(comicData);
    } else {
      return res.status(400).send("Invalid comic ID");
    }
  } catch (error: any) {
    return res.status(500).send(error.message);
    logger.error(error);
  }
};

export default handler;
