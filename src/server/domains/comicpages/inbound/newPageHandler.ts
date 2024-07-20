import { NextApiHandler } from 'next';
import { withAuth } from "@domains/users/middleware/withAuth";
import { canEditComic } from '@domains/comics/core/comicService';
import { logger } from "@logger";
import { parseForm } from '@services/uploader';
import { ErrorKeys as UserErrorKeys } from '../../users/errors.types'
import { ErrorKeys } from '../errors.types';
import { createComicPage } from '../core/comicPageService';
import { requireEnvVar } from '@logger/envcheck';
const USER_AUTH_TOKEN_NAME = requireEnvVar("NEXT_PUBLIC_USER_AUTH_TOKEN_NAME");

export const config = {
  api: {
    bodyParser: false,
  },
};

const newPageHandler: NextApiHandler = async (req, res) => {
  
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { comicId } = req.query;
  if (!comicId) {
    return res.status(400).json(ErrorKeys.COMIC_MISSING);
  }

  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  if (!token) {
    return res.status(400).json(UserErrorKeys.TOKEN_MISSING);
  }

  try {
    const permissions = await canEditComic(token, Number(comicId))
    if (!permissions.edit) {
      return res.status(403).json(ErrorKeys.USER_NOT_AUTHORIZED)
    }
  } catch (error:any) {
    return res.status(500).json(ErrorKeys.GENERAL_SERVER_ERROR)
  }

  const result = await parseForm(req, 'illustration');
  console.log("the form was parst!!!!!!!!!!!!!!")
  console.log(result)

  if (!result.comic_id) {
    return res.status(400).json(ErrorKeys.COMIC_MISSING);
  } 

  if (!result.page_number) {
    return res.status(400).json(ErrorKeys.PAGE_NUMBER_MISSING);
  }

  if (!result.image) {
    return res.status(400).json(ErrorKeys.IMAGE_MISSING);
  }

  //const newPage = await createComicPage(fields, files);

  if (false) {
    return res.status(200).json(newPage); 
  } else {
    logger.error(newPage.error)
    return res.status(newPage.error === ErrorKeys.INVALID_REQUEST ? 400 : 500).json(newPage.error)
  }
};

export default withAuth(newPageHandler);