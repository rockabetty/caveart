import { PoolClient, QueryResult } from 'pg';
import PoolConnection from './connection';
import {QueryFunction, GenericStringMap} from './types/queries';

export async function queryDbConnection(queryString: string, values: any[] = []): Promise<QueryResult | Error> {
    const pool = PoolConnection.get();
    const client = await pool.connect();
    try {
        return await client.query(queryString, values);
    } catch (err) {
        console.log(err)
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
    ) {
    console.log("Get table called")
    const columnsToSelect = columns.join(", "); 
    const query = `
      SELECT ${columnsToSelect}
      FROM ${table}
      WHERE ${identifierColumn} = $1
    `;
    const values = [identifierValue];
    return await queryDbConnection(query, values)
};

export async function editTable(
    table: string,
    identifierColumn: string,
    identifierValue: string | number,
    update: GenericStringMap
    ) {
    const columnOrder = Object.keys(update);
    const updateString = writeUpdateString(columnOrder);
    const values = [];
    const idPlaceholder = columnOrder.length + 1

    for (const key of columnOrder) {
        values.push(update[key]);
    }
    values.push(identifierValue);

    const query = `
      UPDATE ${table}
      SET ${updateString}
      WHERE ${identifierColumn} = $${idPlaceholder}
    `;
    return await queryDbConnection(query, values)
};
