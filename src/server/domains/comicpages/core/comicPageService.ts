import { createPage, getPage } from '../outbound/pageRepository'
import { ErrorKeys } from '../errors.types';
import { ComicPage } from '../comicpage.types';

export async function createComicPage (data:ComicPage) {
  try {
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

export async function getComicPageByPageNumber (comicId: number, pageNumber) {
	// if logged in and you are the author...
	try {
		const page = await getPage(comicId, pageNumber);
		if (page) {

		}
	}
	/*
	export async function getPage(
  comicId: number,
  pageNumber: number,
): Promise<ComicPage | null> {
  const query = `SELECT * FROM comic_pages WHERE comic_id = $1 AND page_number = $2`;
  const values = [comicId, pageNumber];
  try {
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}
	*/
}