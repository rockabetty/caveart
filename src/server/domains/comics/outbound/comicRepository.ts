import {
  queryDbConnection,
  removeOneToManyAssociations,
  editTable,
  withTransaction
} from "../../../../server/sql-helpers/queryFunctions";
import {
  Comic,
  ComicColumnList,
  Genre,
  NestedContentWarning,
} from "../comic.types";
import { logger } from "@logger";
import { QueryResult } from "pg";
import { handleDatabaseError } from "@errors";
import { ErrorKeys } from "../errors.types";

export async function addComic(comic: Comic, client?: PoolClient): Promise<number | null> {
  console.log("Add comic is running")
  console.log(comic)
  const query = `
      INSERT INTO comics (
        title,
        subdomain,
        description,
        comments,
        is_unlisted,
        is_private,
        moderate_comments,
        thumbnail_image_url,
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
    comic.thumbnail_image_url,
    comic.likes,
    comic.rating,
  ];
  console.log("11111111111111111111111111111111111111111111111111")
  console.log(comic)

  try {
    const result = await queryDbConnection(query, values, client);
    return result.rows[0].id;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getComicIdFromSubdomain(subdomain: string) {
  const query = `SELECT id FROM comics WHERE subdomain = $1 LIMIT 1`;
  const values = [subdomain];
  const result = await queryDbConnection(query, values);
  if (result.rows && result.rows.length > 0) {
    return result.rows[0].id;
  }
}

export async function addGenresToComic(
  comicID: number,
  genreIDs: number[],
  client?: PoolClient
): Promise<QueryResult[] | null> {

  if (genreIDs.length === 0) {
    return null
  }
 
  const insertPromises: Promise<QueryResult>[] = [];
  genreIDs.forEach((genreID) => {
    const query = `
          INSERT INTO comics_to_genres (comic_id, genre_id)
          VALUES ($1, $2)
          RETURNING id
      `;
    const values = [comicID, genreID];
    insertPromises.push(queryDbConnection(query, values, client));
  });
  try {
    const results: QueryResult[] = await Promise.all(insertPromises);
    return results;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function addContentWarningsToComic(
  comicID: number,
  contentIDs: number[],
  client?: PoolClient
): Promise<QueryResult[] | null> {
  console.log("Add CW to comic running")

  if (contentIDs.length === 0) {
    return null
  }

  const insertPromises: Promise<QueryResult>[] = [];
  contentIDs.forEach((contentID) => {
    const query = `
          INSERT INTO comics_to_content_warnings (comic_id, content_warning_id)
          VALUES ($1, $2)
          RETURNING id
      `;
    const values = [comicID, contentID];
    insertPromises.push(queryDbConnection(query, values, client));
  });
  try {
    console.log("inserting cws")
    console.log(contentIDs)
    const results: QueryResult[] = await Promise.all(insertPromises);
    return results;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function addAuthorToComic(
  comicID: number,
  authorID: number,
  client?: PoolClient
): Promise<QueryResult | Error> {
  console.log("Add author")
  const query = `
      INSERT INTO comics_to_authors (comic_id, user_id)
      VALUES ($1, $2)
      RETURNING id
    `;
  const values = [comicID, authorID];
  const result = await queryDbConnection(query, values, client);
  return result.rows[0];
}

export async function isAuthor(
  author: number,
  comic: number | string,
): Promise<boolean | null> {
  const column = typeof comic === "string" ? "subdomain" : "comic_id";
  const query = `SELECT TRUE as isauthor
      FROM comics_to_authors ca
      JOIN comics c
      ON c.id = ca.comic_id
      WHERE
        ca.user_id = $1
        AND ca.${column} = $2`;

  const values = [author, comic];
  try {
    const result = await queryDbConnection(query, values);
    return !!result.rows[0]?.isauthor;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function selectComicProfile(
  comicId: number | string,
): Promise<Comic | null> {
  const identifier = typeof comicId === "number" ? "id" : "subdomain";
  const query = `
  WITH ContentWarnings AS (
    SELECT
      c.id AS comic_id,
      COALESCE(
          jsonb_object_agg(cwparent.name, json_build_object('id', cw.id, 'name', cw.name)) FILTER (WHERE cw.id IS NOT NULL),
          '{}'::jsonb
      ) AS content_warnings
    FROM comics c
    LEFT JOIN comics_to_content_warnings ccw ON ccw.comic_id = c.id
    LEFT JOIN content_warnings cw ON cw.id = ccw.content_warning_id
    JOIN content_warnings cwparent on cwparent.id = cw.parent_id
    WHERE c.${identifier} = $1
    GROUP BY c.id
  ),
  ComicGenres AS (
    SELECT
      c.id AS comic_id,
      COALESCE(
        jsonb_object_agg(g.id, jsonb_build_object('description', g.description, 'name', g.name)) FILTER (WHERE g.id IS NOT NULL),
        '{}'::jsonb
    ) AS genres
    FROM comics c
    LEFT JOIN comics_to_genres cg ON cg.comic_id = c.id
    LEFT JOIN genres g ON g.id = cg.genre_id
    WHERE c.${identifier} = $1
    GROUP BY c.id
  )
  SELECT 
    c.id,
    c.title,
    c.subdomain,
    c.tagline,
    c.description,
    c.thumbnail_image_url as thumbnail,
    c.comments,
    c.is_unlisted,
    c.is_private,
    c.moderate_comments,
    c.view_count,
    c.likes,
    c.like_count,
    r.name as rating,
    COALESCE(cg.genres, '{}'::jsonb) AS genres,
    COALESCE(cw.content_warnings, '{}'::jsonb) AS content_warnings
  FROM comics c
  JOIN ratings r ON r.id = c.rating
  LEFT JOIN ComicGenres cg ON cg.comic_id = c.id
  LEFT JOIN ContentWarnings cw ON cw.comic_id = c.id
  WHERE c.${identifier} = $1
  GROUP BY c.id, cw.content_warnings, cg.genres, r.name`;

  const values = [comicId];
  try {
    const result = await queryDbConnection(query, values);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
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
  const query = baseQuery + conditions + " ORDER BY c.id";

  try {
    const result = await queryDbConnection(query, [authorID]);
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getComicThumbnail(comicID) {
  const query = `SELECT thumbnail_image_url FROM comics WHERE id = $1`;
  const values = [comicID];
  try {
    const result = await queryDbConnection(query, values);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0].thumbnail_image_url;
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function listContentWarnings() {
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
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getNestedContentWarnings() {
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
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getComicGenres(comicId: number): Promise<number[] | null> {
  const query = `
  SELECT array_agg(g.id) as genrelist
  FROM genres g
  JOIN comics_to_genres cg
  ON cg.genre_id = g.id
  WHERE cg.comic_id = $1
  `;
  try {
    const values = [comicId];
    const result = await queryDbConnection(query, values);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0].genrelist
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getComicContentWarnings(
  comicId: number,
): Promise<QueryResult[] | null> {
  const query = `SELECT
    array_agg(content_warning_id::int) as contentlist
    FROM comics_to_content_warnings ccw
    WHERE ccw.comic_id = $1
   `;

  try {
    const values = [comicId];
    const result = await queryDbConnection(query, values);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0].contentlist;
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getAllGenres() {
  try {
    const result = await queryDbConnection(`SELECT id, name FROM genres`);
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getAllContentWarnings() {
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
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getRatingDefs(
  key?: "name" | "id",
): Promise<QueryResult | null> {
  let format = "id, name";
  if (key === "name") {
    format = "name, id";
  }
  try {
    const result = await queryDbConnection(
      `SELECT jsonb_object_agg(${format}) AS comics_json FROM ratings`,
    );
    if (result.rows && result.rows.length === 1) {
      return result.rows[0].comics_json;
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getRatingId(name: string): Promise<number | null> {
  try {
    const result = await queryDbConnection(
      `SELECT id FROM ratings WHERE name = $1`,
      [name],
    );
    if (result.rows && result.rows.length > 0) {
      return result.rows[0]?.id;
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getGenres(): Promise<Genre[] | null> {
  try {
    const result = await queryDbConnection(`SELECT id, name FROM genres`);
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function editComic(
  id: number,
  update: Comic,
): Promise<QueryResult | null> {
  try {
    return await editTable("comics", "id", id, update);
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function deleteComic(comicID: number): Promise<boolean | null> {
  if (Number.isNaN(comicID) || comicID <= 0) {
    return { success: false, message: ErrorKeys.COMIC_ID_INVALID };
  }
  const query = `DELETE FROM comics 
    WHERE id = $1;`;
  const values = [comicID];
  try {
    console.log("Deleting " + comicID);
    const result = await queryDbConnection(query, values);
    if (result.rowCount > 0) {
      console.log("Deletion supposedly worked");
      return true;
    } else {
      console.log("No row count");
      return false;
    }
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function removeAllGenresFromComic(comicID: number) {
  const query = `DELETE FROM comics_to_genres WHERE comic_id = $1`;
  const values = [comicID];
  try {
    const result = await queryDbConnection(query, values);
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function removeAllContentWarningsFromComic(comicID: number) {
  const values = [comicID];
  const checkQuery = `SELECT COUNT(id) FROM comics_to_content_warnings WHERE comic_id = $1`;
  const deleteQuery = `DELETE FROM comics_to_content_warnings WHERE comic_id = $1`;

  try {
    const checkResult = await queryDbConnection(checkQuery, values);
    const count = parseInt(checkResult.rows[0].count, 10);

    if (count === 0) {
      console.log("NOthing to delete");
      return true;
    }

    const deleteResult = await queryDbConnection(deleteQuery, values);
    if (deleteResult.rowCount > 0) {
      console.log("Deleted!");
      return true;
    } else {
      console.log("Nothing was deleted.");
      return false;
    }
  } catch (error) {
    handleDatabaseError(error)
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
  } catch (error) {
    handleDatabaseError(error)
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
  } catch (error) {
    handleDatabaseError(error)
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
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getAuthorsOfComic(
  comic: number,
): Promise<QueryResult | null> {
  try {
    const query = `SELECT
      u.username, u.id
    FROM comics_to_authors ca
    JOIN users u 
      ON u.id = ca.user_id
    WHERE ca.comic_id = $1`;
    const values = [comic];
    const selection = await queryDbConnection(query, values);
    return selection.rows;
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function createComicWithRelations(profile, authorID) {
  const result = withTransaction(async (client) => {
    const comicID = await addComic(profile, client);
    await Promise.all([
      addGenresToComic(comicID, profile.genres, client),
      addContentWarningsToComic(comicID, profile.content, client),
      addAuthorToComic(comicID, authorID, client)
    ]);    
    return comicID;
  });
  return result;
}