import { isAuthor } from '../outbound/comicRepository';
import logger from '@logger';

export async function canEditComic(
  token: string,
  comicId: number,
) {
  try {
    const ifOwnsComic = await isAuthor(userId, comicId);
    return {
      success: true,
      edit: ifOwnsComic
    }
  }
  catch (error: any) {
    logger.error(error)
    return {
      success: false,
      error: error
    }
  }
}