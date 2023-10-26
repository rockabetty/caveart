import {queryDbConnection, editTable} from './queryFunctions';
import {UserModel} from './types/models';

export async function createUser(
    username: string,
    email: string,
    password: string
): Promise<QueryResult | Error> {
    const query = `
      INSERT INTO users
      (username, email, password)
      VALUES
      ($1, $2, $3)
      RETURNING id
    `;
    const values = [username, email, password];
    return await queryDbConnection(query, values);
};

export async function getUserById(
    identifier: number,
    columns?: string[] | null = null
): Promise<QueryResult | Error> {
    const query = `
        SELECT ${columns ? columns.join(",") : "*"}
        FROM users
        WHERE id = $1
    `;

    const values = [identifier]
    return await queryDbConnection(query, values)
};

export async function editUser(
    userId: number,
    update: UserModel
): Promise<QueryResult | Error> {
    return await editTable(
        'users',
        'id',
        userId,
        update
    )
};