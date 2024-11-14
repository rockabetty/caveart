import { NextApiHandler } from "next";
import { ErrorKeys } from "../errors.types";
import { acceptPostOnly, rateLimit } from "@domains/methodGatekeeper";
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { getPresignedUrl } from "@services/uploader";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";

export const presignedUrlHandler: NextApiHandler = async (req, res) => {
  acceptPostOnly(req, res);
  rateLimit(req, res);
  const { tenant } = req.query;
  const { image } = req.body;
  const { fileType, fileName } = image;
  try {
    const comicId = await getComicIdFromSubdomain(tenant);
    const prefix = `uploads/comics/${comicId}/pages`;
    const presignedUrl = getPresignedUrl(fileName, fileType, prefix);
    if (presignedUrl.success) {
      return res.status(200).send(presignedUrl.data);
    }
    return res.status(400).send(ErrorKeys.IMAGE_MISSING);
  } catch (error) {
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
};

export default withAuth(isAuthor(presignedUrlHandler));