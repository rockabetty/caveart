import { NextApiHandler } from "next";
import { ErrorKeys } from "../errors.types";
import { acceptPostOnly, rateLimit } from "@domains/methodGatekeeper";
import { getPresignedUrl } from "@server-services/uploader";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";

export const presignedUploadUrlHandler: NextApiHandler = async (req, res) => {
  acceptPostOnly(req, res);
  rateLimit(req, res);
  const { name, type, tenant } = req.body;

  if (!name || !type) {
    return res.status(400).json({error: ErrorKeys.IMAGE_MISSING})
  }

  if (!tenant) {
    return res.status(400).json({error: ErrorKeys.COMIC_INVALID})
  }

  const extension = name.split(".").pop().toLowerCase();
  if (!extension) {
    return res.status(400).json({ error: ErrorKeys.INVALID_FILE_EXTENSION });
  }

  try {
    // TO DO: Private URLs for private and age restricted (18+) comics
    const prefix = `uploads/comics/public/${tenant}/assets`;
    const presignedUrl = await getPresignedUrl(`thumbnail.${extension}`, type, prefix);
    if (presignedUrl.success) {
      return res.status(200).send(presignedUrl.data);
    }
    return res.status(400).json({error: ErrorKeys.IMAGE_MISSING});
  } catch (error) {
    return res.status(500).json({error: ErrorKeys.GENERAL_SERVER_ERROR});
  }
};

export default withAuth(isAuthor(presignedUploadUrlHandler));