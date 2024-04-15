import { PoolClient, QueryResult } from "pg";

export type QueryFunction = (client: PoolClient) => Promise<QueryResult>;

export type GenericStringMap = {
  [key:string]: string | string[] | number[] | number | Date | boolean | null;
};
