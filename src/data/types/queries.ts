export type QueryFunction = (client: PoolClient) => Promise<QueryResult>;

export type GenericStringMap = {
  [key:string]: string
}