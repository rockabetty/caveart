import { NextApiHandler } from "next";
import { listGenreOptions } from "../core/comicService";
import { ErrorKeys } from "../../../errors.types";

const handler: NextApiHandler = async (_req, res) => {
  try {
    const genres = await listGenreOptions();
    if (genres.success) {
      return res.status(200).send(genres.data);
    }
    return res.status(500).send(genres.error);
  } catch (error: any) {
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default handler;
