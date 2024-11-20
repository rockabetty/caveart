import { NextApiHandler } from 'next';
import { canEditComic } from '@domains/comics/core/comicService';
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { logger } from "@logger";
import { ErrorKeys as UserErrorKeys } from '../../users/errors.types';
import { ErrorKeys } from '../errors.types';
import { deleteComicPage } from '../core/comicPageService';
import { requireEnvVar } from '@logger/envcheck';
const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");
import { acceptPostOnly, requireButDoNotValidateToken } from "@domains/methodGatekeeper";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";

const deletePageHandler: NextApiHandler = async (req, res) => {
  
  acceptPostOnly(req,res);
  
  const { tenant, page_number } = req.query;
  if (!tenant) {
    return res.status(400).json(ErrorKeys.COMIC_MISSING);
  }
  if (!page_number) {
    return res.status(400).json(ErrorKeys.COMIC_PAGE_MISSING);
  }

  try {
    const comicID = await getComicIdFromSubdomain(tenant)

  
    const deletionAttempt = await deleteComicPage(page_number, tenant);
  
    if (deletionAttempt.success) {
      return res.status(200).json(deletionAttempt); 
    } else {
      logger.error(deletionAttempt.error)
      return res.status(deletionAttempt.error === ErrorKeys.INVALID_REQUEST ? 400 : 500).json(deletionAttempt.error)
    }
  
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: ErrorKeys.GENERAL_SERVER_ERROR });
  }
};

export default withAuth(isAuthor(deletePageHandler));