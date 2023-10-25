import { Pool } from 'pg'

const pgConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  user: process.env.PG_USERNAME,
  host: 'localhost',
  database: procss.env.PG_DATABASE || 'caveart',
  password: process.env.PG_PASSWORD,
  port: 5432,
};

export class PoolConnection {
  private static instance: Pool

  private constructor() {}  // Private constructor to prevent direct instantiation

  static get(): Pool {
    if (!this.instance) {
      this.instance = new Pool(pgConfig);

      // Optional: Add error listener for debugging
      this.instance.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err);
      });
    }
    return this.instance
  }
}

export default PoolConnection;