import {queryDbConnection, editTable, getTable} from './queryFunctions';
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