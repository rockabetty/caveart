import {
  queryDbConnection,
  removeOneToManyAssociations,
  editTable,
} from "./queryFunctions";
import { Comic, ComicColumnList, Genre, NestedContentWarning } from "./types";
import { logger } from "../services/logs";
import { QueryResult } from "pg";

export async function createComic(comic: Comic): Promise<number | null> {
  const query = `
      INSERT INTO comics (
        title,
        subdomain,
        description,
        comments,
        is_unlisted,
        is_private,
        moderate_comments,
        thumbnail,
        likes,
        rating
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
  const values = [
    comic.title,
    comic.subdomain,
    comic.description,
    comic.comments,
    comic.is_unlisted,
    comic.is_private,
    comic.moderate_comments,
    comic.thumbnail,
    comic.likes,
    comic.rating,
  ];

  try {
    const result = await queryDbConnection(query, values);
    return parseInt(result.rows[0].id);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function addGenresToComic(
  comicID: number,
  genreIDs: number[],
): Promise<QueryResult[] | null> {
  const insertPromises: Promise<QueryResult>[] = [];
  genreIDs.forEach((genreID) => {
    const query = `
          INSERT INTO comics_to_genres (comic_id, genre_id)
          VALUES ($1, $2)
          RETURNING id
      `;
    const values = [comicID, genreID];
    insertPromises.push(queryDbConnection(query, values));
  });
  try {
    const results: QueryResult[] = await Promise.all(insertPromises);
    return results;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function addContentWarningsToComic(
  comicID: number,
  contentIDs: number[],
): Promise<QueryResult[]> {
  const insertPromises: Promise<QueryResult>[] = [];
  contentIDs.forEach((contentID) => {
    const query = `
          INSERT INTO comics_to_content_warnings (comic_id, content_warning_id)
          VALUES ($1, $2)
          RETURNING id
      `;
    const values = [comicID, contentID];
    insertPromises.push(queryDbConnection(query, values));
  });
  try {
    const results: QueryResult[] = await Promise.all(insertPromises);
    return results;
  } catch (error: any) {
    logger.error(error);
    return error;
  }
}

export async function addAuthorToComic(
  comicID: number,
  authorID: number,
): Promise<QueryResult | Error> {
  const query = `
      INSERT INTO comics_to_authors (comic_id, user_id)
      VALUES ($1, $2)
      RETURNING id
    `;
  const values = [comicID, authorID];
  const result = await queryDbConnection(query, values);
  return result.rows[0];
}

export async function isAuthor(
  author: number,
  comic: number,
): Promise<boolean | null> {
  const query = `SELECT TRUE
      FROM comics_to_authors ca
      JOIN comics c
      ON c.id = ca.comic_id
      WHERE
        ca.user_id = $1
        AND ca.comic_id = $2`;

  const values = [author, comic];
  try {
    const result = await queryDbConnection(query, values);
    return !!result.rows;
  } catch (error: any) {
    throw error;
  }
}

export async function getComic(comicId: number): Promise<Comic | null> {
  const query = `
    SELECT
      title,
      tagline,
      c.description,
      thumbnail,
      comments,
      is_unlisted,
      is_private,
      moderate_comments,
      view_count,
      likes,
      like_count,
      r.name as rating,
      CASE 
        WHEN COUNT(g.id) = 0 THEN '[]'::jsonb
        ELSE jsonb_agg(DISTINCT jsonb_build_object('id', g.id, 'name', g.name))
      END AS genres,
      CASE 
        WHEN COUNT(cw.id) = 0 THEN '[]'::jsonb
        ELSE jsonb_agg(DISTINCT jsonb_build_object('id', cw.id, 'name', cw.name))
      END AS content_warnings
    FROM comics c
    JOIN ratings r
      ON c.rating = r.id
    LEFT JOIN comics_to_genres cg
      ON cg.comic_id = c.id
    LEFT JOIN genres g
      ON g.id = cg.genre_id
    LEFT JOIN comics_to_content_warnings ccw
      ON ccw.comic_id = c.id
    LEFT JOIN content_warnings cw
      ON cw.id = ccw.content_warning_id
    WHERE c.id = $1
      GROUP BY
      c.id, c.title, c.description, r.name
    `;

  const values = [comicId];
  try {
    const result = await queryDbConnection(query, values);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error: any) {
    throw error;
  }
}

export async function getComicsByAuthor(
  authorID: number,
  columns?: ComicColumnList,
  omniscientView: boolean = false,
): Promise<QueryResult[] | null> {
  let conditions = "";
  let columnString = "";
  if (columns) {
    columnString = "c." + columns.join(",c.");
  }
  const columnSelection = columnString ? columnString : "*";
  const baseQuery = `
    SELECT ${columnSelection}
    FROM comics c
    JOIN comics_to_authors ca
    ON ca.comic_id = c.id
    WHERE ca.user_id = $1
  `;

  // TODO: Add whitelisting behavior so users can mark otehr users as allowed to read private comics

  if (!omniscientView) {
    conditions = " AND c.is_private IS NOT TRUE";
  }
  const query = baseQuery + conditions;

  try {
    const result = await queryDbConnection(query, [authorID]);
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getComicContentWarnings(
  comicId: number,
): Promise<QueryResult[] | null> {
  const query = `SELECT
    CASE 
        WHEN COUNT(cw.id) = 0 THEN '{}'::jsonb
        ELSE jsonb_agg(DISTINCT jsonb_build_object(cwp.name, cw.id))
      END AS content_warnings
    FROM comics c
    LEFT JOIN comics_to_content_warnings ccw
      ON ccw.comic_id = c.id
    LEFT JOIN content_warnings cw
      ON cw.id = ccw.content_warning_id
    JOIN content_warnings cwp
      ON cw.parent_id = cwp.id
      WHERE c.id = $1
   `;

  try {
    const values = [comicId];
    const result = await queryDbConnection(query, values);
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getFlatContentWarnings(): Promise<QueryResult | null> {
  const query = `SELECT
    jsonb_object_agg(cw1.id, cw1.name)
    AS comics_json
    FROM content_warnings cw1
    LEFT JOIN content_warnings cw2 
      ON cw1.id = cw2.parent_id
    WHERE cw2.id IS NULL`;

  try {
    const result = await queryDbConnection(query);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0].comics_json;
    }
    return null;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getNestedContentWarnings(): Promise<
  NestedContentWarning[] | null
> {
  const query = `WITH
      Parents AS (
        SELECT id, name
        FROM content_warnings
        WHERE parent_id IS NULL
      ),
      Children AS (
        SELECT p.id AS parent_id, i.id, i.name
        FROM content_warnings i
        JOIN Parents p ON i.parent_id = p.id
      ),
      GrandChildren AS (
        SELECT c.id AS child_id, i.id, i.name
        FROM content_warnings i
        JOIN Children c ON i.parent_id = c.id
      )

      SELECT 
        p.id,
        p.name,
        COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'children', gc_agg)) FILTER (WHERE c.id IS NOT NULL), '[]'::json) AS children
      FROM Parents p
      LEFT JOIN Children c ON p.id = c.parent_id
      LEFT JOIN (
        SELECT child_id, json_agg(json_build_object('id', id, 'name', name)) AS gc_agg
        FROM GrandChildren
        GROUP BY child_id
      ) gc ON gc.child_id = c.id
      GROUP BY p.id, p.name
      `;

  try {
    const result = await queryDbConnection(query);
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getRatingDefs(
  key: "name" | "id",
): Promise<QueryResult | null> {
  let format = "name, id";
  if (key === "id") {
    format = "id, name";
  }
  try {
    const result = await queryDbConnection(
      `SELECT jsonb_object_agg(${format}) AS comics_json FROM ratings`,
    );
    if (result.rows && result.rows.length === 1) {
      return result.rows[0].comics_json;
    }
    return null;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function getGenres(): Promise<Genre[] | null> {
  try {
    const result = await queryDbConnection(
      "SELECT * FROM genres ORDER BY name ASC",
    );
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function editComic(
  comicId: number,
  update: Comic,
): Promise<QueryResult | null> {
  try {
    return await editTable("comics", "id", comicId, update);
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function deleteComic(comic: number): Promise<boolean | null> {
  const query = `DELETE FROM comics 
    WHERE id = $1;`;
  const values = [comic];
  try {
    const result = await queryDbConnection(query, values);
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function removeGenresFromComic(
  comic: number,
  genreList: number[] = [],
): Promise<boolean> {
  const genreColumn = !!genreList ? "genre_id" : undefined;
  try {
    const operation = await removeOneToManyAssociations(
      "comics_to_genres",
      "comic_id",
      comic,
      genreColumn,
      genreList,
    );
    return !!operation;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function removeContentWarningsFromComic(
  comic: number,
  contentList: number[] = [],
): Promise<boolean> {
  const warningColumn = !!contentList ? "content_warning_id" : undefined;
  try {
    const operation = await removeOneToManyAssociations(
      "comics_to_content_warnings",
      "comic_id",
      comic,
      warningColumn,
      contentList,
    );
    return !!operation;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

export async function removeAuthorsFromComic(
  comic: number,
  userList: number[] = [],
): Promise<boolean> {
  const userColumn = !!userList ? "user_id" : undefined;
  try {
    const operation = await removeOneToManyAssociations(
      "comics_to_authors",
      "comic_id",
      comic,
      userColumn,
      userList,
    );
    return !!operation;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}
