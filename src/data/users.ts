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

export async function getUsersWithMatchingAuthCredentials(
    identificationFormat: 'email' | 'username',
    identificationString: string,
    hashedPassword: string
): Promise<QueryResult | Error> {
    const baseQuery = `SELECT id FROM users WHERE password = $2 `;
    const condition = identificationFormat === 'email'
      ? 'AND email = $1'
      : 'AND username = $1';
    const query = baseQuery + condition;
    const values = [identificationString, hashedPassword]
    return await queryDbConnection(query, values);
};

export async function createUserSession(
    userId: string,
    token: string,
    expirationDate: Date
): Promise<QueryResult | Error> {
    const query = `
      INSERT INTO users_sessions
      (user_id, session_token, expiration_date)
      VALUES
      ($1, $2, $3)
      RETURNING user_id, id, session_token
    `;
    const values = [userId, token, expirationDate];
    return await queryDbConnection(query, values);
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