import { NextApiHandler } from 'next';
import { getComicIdFromSubdomain } from "@domains/comics/outbound/comicRepository";
import { logger } from "@logger";
import { ErrorKeys as UserErrorKeys } from '../../users/errors.types';
import { ErrorKeys } from '../errors.types';
import { createComicPage } from '../core/comicPageService';
import { requireEnvVar } from '@logger/envcheck';
import { acceptPostOnly } from "@domains/methodGatekeeper";
import { withAuth } from "@domains/users/middleware/withAuth";
import { isAuthor } from "@domains/comics/middleware/isAuthor";
import { queueImageCompression } from "../outbound/comicPageCompressor";

const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");

const newPageHandler: NextApiHandler = async (req, res) => {  
  acceptPostOnly(req,res);
  
  const { tenant } = req.query;
  if (!tenant) {
    return res.status(400).json(ErrorKeys.COMIC_MISSING);
  }

  try {
    const comicID = await getComicIdFromSubdomain(tenant)

    const {
      imageUrl,
      authorComment,
      releaseOn,
      newPageNumber
    } = req.body;

    const information = {
      imageUrl,
      authorComment,
      releaseOn,
      newPageNumber,
      comicID
    };
  
    const newPage = await createComicPage(information);
  
    if (newPage.success) {
      const {data} = newPage

      try {
        await queueImageCompression({
        'page_id' : data.id,
        'original_url': data.high_res_image_url,
        'comic_id' : comicID,
        'page_number' : data.page_number
      })
      } catch (compressionError) {
        logger.error(compressionError);
      }


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