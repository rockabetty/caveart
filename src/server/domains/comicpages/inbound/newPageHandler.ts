import { NextApiHandler } from 'next';
import { canEditComic } from '@domains/comics/core/comicService';
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { logger } from "@logger";
import { parseFormWithSingleImage } from '@services/uploader';
import { ErrorKeys as UserErrorKeys } from '../../users/errors.types';
import { ErrorKeys } from '../errors.types';
import { createComicPage } from '../core/comicPageService';
import { requireEnvVar } from '@logger/envcheck';
const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");
import { acceptPostOnly, requireButDoNotValidateToken } from "@domains/methodGatekeeper";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";

export const config = {
  api: {
    bodyParser: false,
  },
};

const newPageHandler: NextApiHandler = async (req, res) => {
  
  acceptPostOnly(req,res);
  
  const { tenant } = req.query;
  if (!tenant) {
    return res.status(400).json(ErrorKeys.COMIC_MISSING);
  }

  try {
    const comicID = await getComicIdFromSubdomain(tenant)
    const { files, fields } = await parseFormWithSingleImage(req, 'illustration');
    const information = {
      ...fields,
      comicID
    }
  
    const newPage = await createComicPage(information, files);
  
    if (newPage.success) {
      return res.status(200).json(newPage); 
    } else {
      logger.error(newPage.error)
      return res.status(newPage.error === ErrorKeys.INVALID_REQUEST ? 400 : 500).json(newPage.error)
    }
  
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
};

export default withAuth(isAuthor(newPageHandler));