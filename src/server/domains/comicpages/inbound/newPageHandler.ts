import { NextApiHandler } from 'next';
import { ComicPage } from '../comicpage.types';
import { withAuth } from "@domains/users/middleware/withAuth";
import { logger } from "@logger";
import { parseForm } from '@services/uploader';
import { ErrorKeys } from '../errors.types';
import { createPage } from '../core/comicPageService';

export const config = {
  api: {
    bodyParser: false,
  },
};

const newPageHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { fields, files } = await parseForm(req, 'illustration');

  if (!fields.comic_id) {
    return res.status(400).json(ErrorKeys.COMIC_MISSING);
  }

  if (!fields.page_number) {
    return res.status(400).json(ErrorKeys.PAGE_NUMBER_MISSING);
  }

  if (!files.image) {
    return res.status(400).json(ErrorKeys.IMAGE_MISSING);
  }

  const data: Partial<ComicPage> = {
    page_number: Number(fields.page_number[0]),
    img: files.image[0].newFilename,
    comic_id: Number(fields.comic_id[0])
  };

  if (fields.chapter_id) {
    data.chapter_id = Number(fields.chapter_id[0])
  }
  if (fields.author_comment) {
    data.author_comment = fields.author_comment[0]
  }
  if (fields.release_on) {
    data.release_on = new Date(fields.release_on[0])
  }

  const newPage = await createPage(data);

  if (newPage.success) {
    return res.status(200).json(newPage); 
  } else {
    logger.error(newPage.error)
    return res.status(500).json(newPage.error)
  }
};

export default withAuth(newPageHandler);