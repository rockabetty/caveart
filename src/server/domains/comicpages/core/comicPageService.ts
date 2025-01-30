import { Redis } from 'ioredis'
import { getComicThumbnails, createPageData, getLastPageReference, getPage } from '../outbound/pageRepository'
import { addComicImageToDatabase } from '@server-services/uploader'
import { ErrorKeys } from '../errors.types';
import { ComicPage as ComicPageDatabaseEntry } from '../comicpage.types';
import { ComicPage as ComicPagePostData } from '@features/comic/pages/types';
import formidable from 'formidable';
import logger from '@logger';
import { requireEnvVar } from '@logger/envcheck';


const REDIS_URL = requireEnvVar("REDIS_URL");
   
export async function validateComicPage (fields: formidable.Fields, files: formidable.Files) {
  if (!fields.newPageNumber || !fields.releaseDate || !files['image[]']) {
    return {
      success: false,
      error: ErrorKeys.INVALID_REQUEST
    }
  }
}

export async function getThumbnails (comicID, offset = 0, limit = 20, chapter, omniscient) {

  try {
    const data = await getComicThumbnails(comicID, offset, limit, chapter, omniscient);
    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR
    }
  }

}

export async function createComicPage (fields: ComicPagePostData) {

  if (!fields.comicID || !fields.newPageNumber || !fields.imageUrl) {
      return {
        success: false,
        error: ErrorKeys.INVALID_REQUEST
      }
    }

  const redis = new Redis(REDIS_URL)

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
      await redis.lpush('celery', JSON.stringify({
        task: 'processor.tasks.process_comic_image',
        args: [
          page.id,
          page.high_res_image_url,
          page.comic_id,
          page.page_number
        ],
        kwargs: {},
        retries: 0
      }));

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
  } finally {
    await redis.quit()
  }
}

export async function getLastPageNumber (comicId: number,
  omniscientPOV = false
  ) {
  try {
    const latestPageRef = await getLastPageReference(comicId, omniscientPOV);
    const number = latestPageRef?.page_number
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