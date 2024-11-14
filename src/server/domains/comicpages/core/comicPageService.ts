import { createPageData, getLastPageReference, getPage } from '../outbound/pageRepository'
import { addComicImageToDatabase } from '@services/uploader'
import { ErrorKeys } from '../errors.types';
import { ComicPage as ComicPageDatabaseEntry } from '../comicpage.types';
import { ComicPage as ComicPagePostData } from '@features/comic/pages/types';
import formidable from 'formidable';
import logger from '@logger';

export async function validateComicPage (fields: formidable.Fields, files: formidable.Files) {
  if (!fields.newPageNumber || !fields.releaseDate || !files['image[]']) {
    return {
      success: false,
      error: ErrorKeys.INVALID_REQUEST
    }
  }
}

export async function createComicPage (fields: ComicPagePostData) {

  console.log(fields)

  if (!fields.comicID || !fields.newPageNumber || !fields.imageUrl) {
      return {
        success: false,
        error: ErrorKeys.INVALID_REQUEST
      }
    }

  try {

    let data: ComicPage = {
      page_number: Number(fields.newPageNumber),
      high_res_image_url: fields.imageUrl,
      comic_id: Number(fields.comicID),
      author_comment: fields.authorComment,
      release_on: new Date().toISOString()
    };

    if (fields.releaseOn) {
      data.release_on = new Date(fields.releaseOn).toISOString();
    }

    if (fields.chapter_id) {
      data.chapter_id = Number(fields.chapter_id)
    }

  	const page = await createPageData(data)
  	if (page) {
  		return {
  		  success: true,
  	  	data: page
  	  }
  	} else {
  		return {
  			success: false,
  			error: ErrorKeys.GENERAL_SERVER_ERROR
  		}
  	}
  } catch (error: any) {
  	return {
  		success: false,
  		error: error
  	}
  }
}

export async function getNextNewPageNumber (comicId: number,
  omniscientPOV = false
  ) {
  try {
    const latestPageRef = await getLastPageReference(comicId, omniscientPOV);
    const number = latestPageRef?.page_number + 1;
    return {
      success: true,
      number
    }
  } catch (error: any) {
    logger.error(error)
    return {
      success: false,
      error
    }
  }
}

export async function getComicPageByPageNumber (
  comicId: number,
  pageNumber:number,
  omniscientPOV = false
) {
  try {
		const page = await getPage(comicId, pageNumber);
      if (omniscientPOV) {
        return {
          success: true,
          data: page
        }
      }
      if (page?.release_on) {
        const releaseDate = new Date(page.release_on).getTime();
        const now = new Date().getTime();
        if (now >= releaseDate) {
          return {
            success: true,
            data: page
          }
        }
      }
      return {
        success: false,
        error: ErrorKeys.ACCESS_DENIED
      }
		} catch (error:any) {
      logger.error(error)
      return {
        success: false,
        error: error
      }
    }
  }