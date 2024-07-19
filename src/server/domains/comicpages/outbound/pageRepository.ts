import {queryDbConnection,
 editTable,
  getTable, 
  getOneRowResult } from '../../../sql-helpers/queryFunctions';
import { convertUTCStringToDate } from '../../../services/timestamps';
import { QueryResult } from 'pg';
import { ErrorKeys, ClientError } from '../errors.types';
import { ComicPage } from '../pages.types'

export async function createPage(
  pageData
): Promise<QueryResult | null> {

  const {
    page_number,
    img,
    comic_id,
    chapter_id,
    author_comment
  } = pageData

  const query = `
    INSERT INTO comic_pages
    (page_number, img, comic_id, chapter_id, author_comment)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const values = [page_number, img, comic_id, chapter_id, author_comment];
  
  try {
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  }

  catch (error: any) {
    logger.error(error);
    throw error;
  }
};

export async function getPage(
  comicId,
  pageNumber
  ): Promise<ComicPage | null> {

  const query = `SELECT * FROM comic_pages WHERE comic_id = $1 AND page_number = $2`;
  const values = [comicId, pageNumber];
  try {
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  }

  catch (error: any) {
    logger.error(error)
    throw error;
  }
}

export async function editPage(
  pageId,
  update: ComicPage
  ): Promise<QueryResult | null> {

  try {
    return await editTable(
      'pages',
      'id',
      pageId,
      update
    );
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export function deletePage(
  pageId: number): Promise<QueryResult | null> {
  try {
    const query = `DELETE from comic_pages WHERE id = $1`;
    const values = [pageId];
    const result = await queryDbConnection(query, values)
    return result
  }
  catch (error: any) {
    logger.error(error);
    throw error;
  }
}