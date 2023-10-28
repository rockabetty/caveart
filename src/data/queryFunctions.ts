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