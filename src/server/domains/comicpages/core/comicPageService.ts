import { createPage, getLastPageReference, getPage } from '../outbound/pageRepository'
import { ErrorKeys } from '../errors.types';
import { ComicPage } from '../comicpage.types';
import formidable from 'formidable';
import logger from '@logger';

export async function createComicPage (fields: formidable.Fields, files: formidable.Files) {
  try {

    let data: ComicPage = {
      page_number: 0,
      img: "",
      comic_id: 0,
      release_on: new Date().toISOString()
    };

    if (!fields.page_number || !fields.comic_id || !files.image) {
      return {
        success: false,
        error: ErrorKeys.INVALID_REQUEST
      }
    } else {
      data.page_number = Number(fields.page_number[0])
      data.img = files.image[0].newFilename
      data.comic_id = Number(fields.comic_id[0])
    }

    if (fields.chapter_id) {
      data.chapter_id = Number(fields.chapter_id[0])
    }
    if (fields.author_comment) {
      data.author_comment = fields.author_comment[0]
    }
    if (fields.release_on) {
      const releaseDate = fields.release_on[0]
      data.release_on = new Date(releaseDate).toISOString()
    }

  	const page = await createPage(data)
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

export async function getNextPageNumber (comicId: number,
  omniscientPOV = false
  ) {
  try {
    const latestPageRef = await getLastPageReference(comicId, omniscientPOV);
    const number = latestPageRef?.page_number;
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