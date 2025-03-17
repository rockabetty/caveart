import { NextApiHandler } from "next";
import { ErrorKeys } from "../errors.types";
import { ErrorKeys as CoreErrorKeys } from "../../../errors.types";
import { getLastPageNumber } from "../core/comicPageService";
import { acceptGetOnly } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { sendErrorResponse } from "../../../errors";

export const lastPageNumberHandler: NextApiHandler = async (req, res) => {
  acceptGetOnly(req, res);
  const { tenant } = req.query;
  const comicID = await getComicIdFromSubdomain(tenant);
  if (isNaN(comicID)) {
    return sendErrorResponse(res, ErrorKeys.COMIC_INVALID);
  }

  const result = await getLastPageNumber(comicID);
  if (result.success) {
    return res.status(200).send({ number: result.number });
  }
  return sendErrorResponse(res, CoreErrorKeys.GENERAL_SERVER_ERROR);
};

export default lastPageNumberHandler;
