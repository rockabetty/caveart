import { Pool } from 'pg'
import { requireEnvVar } from '../errors/envcheck'

const user = requireEnvVar('PG_USERNAME');
const database = requireEnvVar('PG_DATABASE'); 
const password = requireEnvVar('PG_PASSWORD');
const host = requireEnvVar('PG_HOST')

const pgConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  user,
  host,
  database,
  password,
  port: process.env.PG_PORT || 5432
};

export class PoolConnection {
  private static instance: Pool

  private constructor() {}  // Private constructor to prevent direct instantiation

  static get(): Pool {
    if (!this.instance) {
      this.instance = new Pool(pgConfig);

      this.instance.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err);
        throw new Error(err);
      });

      // Connection check
      this.instance.connect((err, client, done) => {
        done();  // release the client back to the pool
        if (err) {
          if (err.code === 'ETIMEDOUT') {
            throw new Error('Database connection timed out.');
          } else if (err.code === 'ECONNREFUSED') {
            throw new Error('Database connection was refused.');
          } else {
            throw err;
          }
        }
      });
    }
    return this.instance;
  }
}

export default PoolConnection;