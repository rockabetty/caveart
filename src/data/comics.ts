import {queryDbConnection, getParentsAndChildren, buildOneToManyRowValues, removeOneToManyAssociations, editTable, getTable} from './queryFunctions';
import {ComicModel} from './types/models';

export async function createComic(
    comic: ComicModel
): Promise<QueryResult | Error> {
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
      comic.isUnlisted,
      comic.isPrivate,
      comic.moderate_comments,
      comic.thumbnail,
      comic.likes,
      comic.rating
    ];
    const result = await queryDbConnection(query, values);
    return result.rows[0]
};

export async function addGenresToComic(
    comicID: number,
    genreIDs: number[]
): Promise<QueryResult[]> {
    const insertPromises: Promise<QueryResult>[] = [];
    genreIDs.forEach(genreID => {
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
    } catch (error) {
        return error;
    }
};

export async function addContentWarningsToComic(
    comicID: number,
    contentIDs: number[]
): Promise<QueryResult[]> {
    const insertPromises: Promise<QueryResult>[] = [];
    contentIDs.forEach(contentID => {
      const query = `
          INSERT INTO comics_to_content_warnings (comic_id, content_warning_id)
          VALUES ($1, $2)
          RETURNING id
      `;
      const values = [comicID, contentIDs];
      insertPromises.push(queryDbConnection(query, values));
    });
    try {
        const results: QueryResult[] = await Promise.all(insertPromises);
        return results;
    } catch (error) {
        return error;
    }
};

export async function addAuthorToComic(
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
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }
    return null;
}

export async function getGenres(): Promise<QueryResult | Error> {
  const result = await queryDbConnection('SELECT * FROM genres ORDER BY name ASC');
  if (result.rows && result.rows.length > 0) {
    return result.rows;
  }
  return null;
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

export async function removeGenresFromComic(comic: number, genreList: number[] = null): Promise<boolean> {
    const genreColumn = !!genreList ? 'genre_id' : null;
    const operation = await removeOneToManyAssociations(
      'comics_to_genres',
      'comic_id',
      comic,
      genreColumn,
      genreList
    )
    if (operation.rowCount > 0) {
      return true;
    } else {
      return false;
    }
};

export async function removeContentWarningsFromComic(comic: number, contentList: number[] = null): Promise<boolean> {
    const warningColumn = !!contentList ? 'content_warning_id' : null;
    const operation = await removeOneToManyAssociations(
      'comics_to_content_warnings',
      'comic_id',
      comic,
      warningColumn,
      contentList
    )
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
};

export async function removeAuthorsFromComic(comic: number, userList: number[] = null): Promise<boolean> {
    const userColumn = !!userList ? 'user_id' : null;
    const operation = await removeOneToManyAssociations(
      'comics_to_authors',
      'comic_id',
      comic,
      userColumn,
      userList
    )
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
};
