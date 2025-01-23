import {
  queryDbConnection,
  editTable,
  getOneRowResult,
} from "../../../sql-helpers/queryFunctions";
import { QueryResult } from "pg";
import { ComicPage, PageReference, ComicChapter } from "../comicpage.types";
import logger from "@logger";

export async function createPageData(
  pageData: ComicPage,
): Promise<QueryResult | null> {
  const { page_number, comic_id, chapter_id, high_res_image_url, author_comment } = pageData;

  const query = `
    INSERT INTO comic_pages
    (page_number, comic_id, chapter_id, high_res_image_url, author_comment)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const values = [page_number, comic_id, chapter_id, high_res_image_url, author_comment];

  try {
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function createChapter(
  chapterData: ComicChapter
  ) {

  const {
    comic_id,
    chapter_number
  } = chapterData;

  let {
    name,
    description,
    thumbnail_image_url
  } = chapterData;

  if (!thumbnail_image_url) {
    thumbnail_image_url = null
  }
  if (!description) {
    description = null;
  }
  if (!name) {
    name = null;
  }

  const query = `
    INSERT INTO comic_chapters
      (comic_id, chapter_number, name, description, thumbnail_image_url)
      VALUES ($1, $2, $3, $4, $5)
    `;

  const values = [comic_id, chapter_number, name, description, thumbnail_image_url];
  try {
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result)
  } catch (error: any) {
    logger.error(error);
    throw error;
  }

}

export async function getPage(
  comicId: number,
  pageNumber: number,
): Promise<ComicPage | null> {
  const query = `SELECT 
    title,
    low_res_image_url,
    high_res_image_url,
    transcript,
    author_comment,
    enable_html_author_comment,
    mouseover_text,
    like_count,
    view_count, 
    FROM comic_pages WHERE comic_id = $1 AND page_number = $2`;
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

export async function getLastPageReference(
  comicId: number,
  omniscientPOV = false,
): Promise<PageReference | null> {
  try {
    const query = `
    WITH latest_page AS (
    SELECT page_number
    FROM comic_pages
    ${
      omniscientPOV
        ? "WHERE comic_id = $1"
        : "WHERE comic_id = $1 AND release_on <= NOW()"
    }
    ORDER BY page_number DESC
    LIMIT 1
    )
    SELECT 
      COALESCE((SELECT page_number FROM latest_page), 0) AS page_number`;
    const values = [comicId];
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getComicThumbnails(
  comicId: number,
  offset: number = 0,
  limit: number = 20,
  chapterId: number,
  omniscientPOV = false,
): Promise<PageReference | null> {
  try {
    // TO DO: Change high res to thumbnail when thumbnails are working out
    const query = `
    SELECT 
      p.id,
      p.title,
      page_number as "pageNumber",
      high_res_image_url as "imageUrl",
      release_on as "releaseOn",
      CONCAT('/comic/', c.subdomain, '/pages/', p.id) AS "link"
    FROM comic_pages p
    JOIN comics c ON c.id = p.comic_id
    ${
      omniscientPOV
        ? "WHERE p.comic_id = $1"
        : "WHERE p.comic_id = $1 AND p.release_on <= NOW()"
    }
    ORDER BY page_number ASC
    LIMIT $2
    OFFSET $3
    `;

    const values = [comicId, limit, offset];

    const result = await queryDbConnection(query, values);
    return result.rows;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getAdjacentPageReferences(
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

export async function getFirstPageReference(
  comicId: number,
): Promise<PageReference | null> {
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
