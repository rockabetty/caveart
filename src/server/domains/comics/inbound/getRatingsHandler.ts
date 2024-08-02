import { NextApiHandler } from "next";
import { listRatingOptions } from "../core/comicService";
import { ErrorKeys } from "../../../errors.types";

const handler: NextApiHandler = async (_req, res) => {
  try {
    const ratings = await listRatingOptions();
    if (ratings.success) {
      return res.status(200).send(ratings.data);
    }
    return res.status(500).send(ratings.error);
  } catch (error: any) {
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default handler;
