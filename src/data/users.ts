import {queryDbConnection, editTable} from './queryFunctions';
import {UserModel} from './types/models';

export async function createUser(
    username: string,
    email: string,
    hashedEmail: string,
    password: string
): Promise<QueryResult | Error> {
    const query = `
      INSERT INTO users
      (username, email, hashed_email, password)
      VALUES
      ($1, $2, $3, $4)
      RETURNING id
    `;
    console.log(query);
    const values = [username, email, hashedEmail, password];
    console.log(values);
    const response = await queryDbConnection(query, values);
    return response
};

export async function getUserById(
    identifier: number,
    columns?: string[] | null
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

export async function getUserSession(
    token: string
): Promise<QueryResult | Error> {
    const query = `
      SELECT * FROM user_sessions WHERE session_token = $1
    `;

    const values = [token];
    const result = await queryDbConnection(query, values);

    if (result.rows && result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

export async function clearUserSession(
    userId: string,
    token: string
): Promise<QueryResult | Error> {
    const query = `DELETE FROM user_sessions WHERE user_id = $1 and session_token = $2`;
    const values = [userId, token];
    const result = await queryDbConnection(query, values);
    if (result.rowCount > 0) {
      return true;  // Session was cleared
    } else {
      return false; // No session found for given token
    }
}

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