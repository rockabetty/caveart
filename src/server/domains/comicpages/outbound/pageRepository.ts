import {
  queryDbConnection,
  editTable,
  getOneRowResult,
} from "../../../sql-helpers/queryFunctions";
import { QueryResult } from "pg";
import { ComicPage } from "../comicpage.types";
import logger from "@logger";

export async function createPage(
  pageData: ComicPage,
): Promise<QueryResult | null> {
  const { page_number, img, comic_id, chapter_id, author_comment } = pageData;

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
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

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

export async function editPage(
  pageId: number,
  update: ComicPage,
): Promise<QueryResult | null> {
  try {
    return await editTable("pages", "id", pageId, update);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getLastPage(
  comicId: number,
): Promise<Partial<ComicPage> | null> {
  try {
    const query = `
    SELECT 
      id,
      page_number
    FROM comic_pages
    WHERE comic_id = $1
    ORDER BY page_number
    DESC limit 1`;
    const values = [comicId];
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getAdjacentPages(
  comicId: number,
  currentPage: number,
): Promise<Partial<ComicPage> | null> {
  try {
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const query = `
    SELECT
      id,
      page_number
    FROM comic_pages
    WHERE comic_id = $1
    AND page_number in ($2, $3)
    ORDER BY page_number ASC
    limit 2`;
    const values = [comicId, prevPage, nextPage];
    const result = await queryDbConnection(query, values);
    let navigation: Partial<ComicPage> = {
      next_id: undefined,
      prev_id: undefined,
    };

    result.rows.forEach((row) => {
      if (row.page_number === prevPage) {
        navigation.prev_id = row.id;
      } else {
        navigation.next_id = row.id;
      }
    });
    return navigation;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

export async function getFirstPage(
  comicId: number,
): Promise<Partial<ComicPage> | null> {
  try {
    const query = `
    SELECT 
      id,
      page_number
    FROM comic_pages
    WHERE comic_id = $1
    ORDER BY page_number
    ASC limit 1`;
    const values = [comicId];
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function deletePage(pageId: number): Promise<QueryResult | null> {
  try {
    const query = `DELETE from comic_pages WHERE id = $1`;
    const values = [pageId];
    const result = await queryDbConnection(query, values);
    return result;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}
