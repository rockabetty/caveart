import { PoolClient, QueryResult, QueryResultRow } from 'pg';
import PoolConnection from './connection';
import {GenericStringMap} from './types';

export type QueryFunction = (client: PoolClient) => Promise<QueryResult>;

export type GenericStringMap = {
  [key:string]: string | string[] | number[] | number | Date | boolean | null;
};


const tableNames = new Set([
  'chapters',
  'comic_pages',
  'comic_tags',
  'comics',
  'comics_to_authors',
  'comics_to_content_warnings',
  'comics_to_genres',
  'comics_to_styles',
  'content_warnings',
  'genres',
  'ratings',
  'usage_devices',
  'users',
  'users_sessions'
]);

const _isValidTable = function (table: string): boolean {
  return tableNames.has(table)
}

export async function queryDbConnection(queryString: string, values: any[] = []): Promise<QueryResult> {
    const pool = PoolConnection.get();
    const client = await pool.connect();
    try {
        return await client.query(queryString, values);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

export function writeUpdateString(columnsToUpdate: string[]): string {
    const setClauses = [];
    for (let i = 0; i < columnsToUpdate.length; i+= 1) {
        const column = columnsToUpdate[i]
        setClauses.push(`${column} = $${i + 1}`);
    }
    if (setClauses.length === 0) {
        throw new Error('No update fields provided');
    }
    return setClauses.join(", ");
};

/**
 * Builds a string representation of one-to-many relationships suitable for SQL insertion.
 * 
 * @param one - The 'one' side of the relationship.
 * @param many - An array representing the 'many' side of the relationship.
 * @returns A string in the format `(one, many[0]), (one, many[1]), ...`
 */
export function buildOneToManyRowValues(one: number, many: number[]): string {
  return many.map(m => `(${one}, ${m})`).join(', ');
}

export async function getTable(
    table: string,
    identifierColumn: string,
    identifierValue: string | number,
    columns: string[]
    ): Promise<QueryResult> {
    const columnsToSelect = columns.join(", "); 
    const query = `
      SELECT ${columnsToSelect}
      FROM ${table}
      WHERE ${identifierColumn} = $1
    `;
    const values = [identifierValue];
    const result = await queryDbConnection(query, values)
    if (result instanceof Error) {
        throw result;
    }
    return result;
};

export async function editTable(
  table: string,
  identifierColumn: string,
  identifierValue: string | number,
  update: GenericStringMap
): Promise<QueryResult | null> {
  const columnOrder = Object.keys(update);
  const updateString = writeUpdateString(columnOrder);
  const values = [...columnOrder.map(key => update[key]), identifierValue];
  const idPlaceholder = columnOrder.length + 1;

  // Ensure table and identifierColumn are safe to use in the query
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table) || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifierColumn)) {
    throw new Error('Invalid table or column name');
  }

  const query = `
    UPDATE ${table}
    SET ${updateString}
    WHERE ${identifierColumn} = $${idPlaceholder}
  `;

  try {
    return await queryDbConnection(query, values);
  } catch (error: any) {
    console.error("editTable error", error);
    throw error;
  }
}

export function getOneRowResult<T extends QueryResultRow>(result: QueryResult<T> ): T | null {
    if (result instanceof Error) {
        throw result;
    }
    return result.rows.length > 0 ? result.rows[0] : null;
};

export async function removeOneToManyAssociations(
    table: string,
    oneColumn: string,
    oneID: number,
    manyColumn?: string,
    manyIDs?: number[]
): Promise<QueryResult[]> {

    if (!_isValidTable(table)) {
        throw new Error("Invalid table name");
    }

    // TODO: Constrain to only valid columns

    if (!manyColumn || !manyIDs || manyIDs.length === 0) {
        const query = `DELETE FROM ${table} WHERE ${oneColumn} = $1`;
        const values = [oneID];
        return [await queryDbConnection(query, values)];
    }

    const deletePromises: Promise<QueryResult>[] = [];

    manyIDs.forEach(manyID => {
        const query = `
            DELETE FROM ${table} WHERE ${oneColumn} = $1 AND ${manyColumn} = $2
        `;
        const values = [oneID, manyID];
        deletePromises.push(queryDbConnection(query, values));
    });

    return await Promise.all(deletePromises);
};