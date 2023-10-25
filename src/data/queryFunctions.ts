import { PoolClient, QueryResult } from 'pg';
import PoolConnection from './connection.ts';
import {QueryFunction} from './types/queries';

export async function queryDbConnection(queryString: string, values: any[] = []): Promise<QueryResult | Error> {
    const pool = PoolConnection.get();
    const client = await pool.connect();
    try {
        return await client.query(queryString, values);
    } catch (err) {
        return new Error('Database operation failed');
    } finally {
        client.release();
    }
}