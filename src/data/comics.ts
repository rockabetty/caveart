import {queryDbConnection, getParentsAndChildren, editTable, getTable} from './queryFunctions';
import {ComicModel} from './types/models';

export async function createComic(
    comic: ComicModel
): Promise<QueryResult | Error> {
    const query = `
      INSERT INTO comics (
        name,
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
    const values = [comic.name, comic.subdomain, comic.description, comic.comments, comic.isUnlisted, comic.isPrivate, comic.moderate, comic.thumbnail, comic.likes, comic.rating]
    const result = await queryDbConnection(query, values);
    return data.rows[0];
};

export async function addAuthor(
    comicID: number,
    authorID: number
): Promise<QueryResult | Error> {
    const sql = `
      INSERT INTO comics_to_authors (comic_id, user_id)
      VALUES ($1, $2)
      RETURNING id
    `
    const values = [comicID, authorID]
    const result = await queryDbConnection(query, values);
    return data.rows[0];
};

export async function isAuthor(
    author: number,
    comic: number
): Promise<QueryResult | Error> {
    const sql = `SELECT TRUE
      FROM comics_to_authors ca
      JOIN comics c
      ON c.id = ca.comic_id
      WHERE
        ca.user_id = $1
        AND ca.comic_id = $2`;

    const values = [author, comic]
    const result = await queryDbConnection(query, values);
    return !!data.rows;
};

export async function getComic(
    comicId: number,
    columns: ComicModel
): Promise<QueryResult | Error> {
    const result = await getTable(
      'comics',
      'id',
      comicId,
      columns
    );

    if (result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
};

export async function getContentWarningDefs(): Promise<QueryResult | Error> {
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

    const result = await queryDbConnection(query);

    console.log(result);

    if (result.rows && result.rows.length > 0) {
      return result.rows
    }
    return null;
}

export async function getGenres(): Promise<QueryResult | Error> {

}

export async function editComic(
    comicId: number,
    update: ComicModel
): Promise<QueryResult | Error> {
    return await editTable(
        'comics',
        'id',
        comicId,
        update
    );
};

export async function deleteComic(comic: number): Promise<QueryResult | Error> {
    const sql = `DELETE FROM comics 
    WHERE id = $1;`
    const values = [comic]
    const result = await queryDbConnection(query, values);
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
};