import { NextApiHandler } from "next";
import { listContentWarningOptions } from "../core/comicService";
import { ErrorKeys } from "../../../errors.types";

const handler: NextApiHandler = async (_req, res) => {
  try {
    const content = await listContentWarningOptions();
    if (content.success) {
      return res.status(200).send(content.data);
    }
    return res.status(500).send(content.error);
  } catch (error: any) {
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default handler;
