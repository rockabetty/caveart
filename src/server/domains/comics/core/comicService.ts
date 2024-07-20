import { isAuthor } from '../outbound/comicRepository';
import logger from '@logger';
import extractUserIdFromToken from '@domains/users/utils/extractUserIdFromToken';

export async function canEditComic(
  token: string,
  comicId: number | string,
) {
  try {
    const userId = await extractUserIdFromToken(token);
    const ifOwnsComic = await isAuthor(Number(userId), comicId);
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

