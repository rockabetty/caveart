import { NextApiHandler } from "next";
import { ErrorKeys } from "../errors.types";
import { ErrorKeys as CoreErrorKeys } from "../../errors.types";
import { acceptPostOnly, rateLimit } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { getPresignedUrl } from "@server-services/uploader";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";
import { sendErrorResponse } from "../../../errors";

export const presignedUploadUrlHandler: NextApiHandler = async (req, res) => {
  acceptPostOnly(req, res);
  rateLimit(req, res);
  const { tenant } = req.query;
  const { name, type } = req.body;

  try {
    const comicId = await getComicIdFromSubdomain(tenant);
    // TO DO: Private URLs for private and age restricted (18+) comics
    const prefix = `uploads/comics/public/${comicId}/pages`;
    const presignedUrl = await getPresignedUrl(name, type, prefix);
    if (presignedUrl.success) {
      return res.status(200).send(presignedUrl.data);
    }
    return sendErrorResponse(ErrorKeys.IMAGE_MISSING);
  } catch (error) {
    return sendErrorResponse(CoreErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default withAuth(isAuthor(presignedUploadUrlHandler));
