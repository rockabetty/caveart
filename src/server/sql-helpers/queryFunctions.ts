import { PoolClient, QueryResult, QueryResultRow } from 'pg';
import PoolConnection from './connection';
import {GenericStringMap} from './types';
import {ErrorKeys} from '../errors.types';

export type QueryFunction = (client: PoolClient) => Promise<QueryResult>;

export type GenericStringMap = {
  [key:string]: string | string[] | number[] | number | Date | boolean | null;
};

class QueryExecutionError extends Error {
  constructor(
  message: string, 
  public query: string, 
  public params: any[], 
  public errorKey: ErrorKeys = ErrorKeys.GENERAL_SERVER_ERROR
  ) {
  super(message);
  this.name = 'QueryExecutionError';
  }
}

class ValidationError extends Error {
  constructor(
  message: string, 
  public query: string, 
  public params: any[], 
  public errorKey: ErrorKeys = ErrorKeys.VALIDATION_ERROR
  ) {
  super(message);
  this.name = 'ValidationError';
  }
}

export async function queryDbConnection(queryString: string, values: any[] = []): Promise<QueryResult> {
  const pool = PoolConnection.get();
  const client = await pool.connect();
  try {
    return await client.query(queryString, values);
  } catch (err) {
    throw new QueryExecutionError(
      'Failed to execute database query',
      queryString,
      values,
      ErrorKeys.GENERAL_SERVER_ERROR 
    );
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
    throw new ValidationError('No update fields provided');
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
  try {
    return await queryDbConnection(query, values);
  } catch (err) {
    throw new QueryExecutionError(
      `Error fetching data from table: ${table}`,
      query,
      values,
      ErrorKeys.RESOURCE_NOT_FOUND 
    );
  }
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
  
  const query = `
  UPDATE ${table}
  SET ${updateString}
  WHERE ${identifierColumn} = $${idPlaceholder}
  `;
  
  try {
  return await queryDbConnection(query, values);
  } catch (error: any) {
    throw new QueryExecutionError(
      `Failed to update table: ${table}`,
      query,
      values,
      ErrorKeys.GENERAL_SERVER_ERROR
    );
  }
}

export function getOneRowResult<T extends QueryResultRow>(result: QueryResult<T>): T | null {
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function removeOneToManyAssociations(
  table: string,
  oneColumn: string,
  oneID: number,
  manyColumn?: string,
  manyIDs?: number[]
): Promise<QueryResult[]> {
  
  //  when manyColumn or manyIDs are optional because if not provided, all associations are deleted.
  if (!manyColumn || !manyIDs || manyIDs.length === 0) {
    const query = `DELETE FROM ${table} WHERE ${oneColumn} = $1`;
    const values = [oneID];

    try {
      return [await queryDbConnection(query, values)];
    } catch (err) {
      throw new QueryExecutionError(
        `Failed to delete all associations in table ${table}`,
        query,
        values,
        ErrorKeys.GENERAL_SERVER_ERROR
      );
    }
  }

  const deletePromises: Promise<QueryResult>[] = [];

  manyIDs.forEach(manyID => {
    const query = `
      DELETE FROM ${table} WHERE ${oneColumn} = $1 AND ${manyColumn} = $2
    `;
    const values = [oneID, manyID];

    deletePromises.push(
      queryDbConnection(query, values).catch((err) => {
        throw new QueryExecutionError(
          `Failed to delete association in table: ${table}, ${oneColumn} = ${oneID}, ${manyColumn} = ${manyID}`,
          query,
          values,
          ErrorKeys.GENERAL_SERVER_ERROR
        );
      })
    );
  });

  try {
    return await Promise.all(deletePromises);
  } catch (err) {
    // Catch any errors from Promise.all (in case multiple deletions fail)
    logger.error(`Failed to delete multiple associations in table: ${table}`, err);
    throw new QueryExecutionError(
      `Failed to delete multiple associations in table ${table}`,
      `DELETE FROM ${table}`,
      [oneID, manyIDs],
      ErrorKeys.GENERAL_SERVER_ERROR
    );
  }
}
