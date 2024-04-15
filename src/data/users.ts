import {queryDbConnection, editTable, getTable, getOneRowResult } from './queryFunctions';
import { convertUTCStringToDate } from '../services/timestamps';
import { UserModel, UserSession, CreatedUserResult, UserColumnsArray } from './types/models';
import { QueryResult } from 'pg';
import { ErrorKeys } from '../services/auth/types/errors';

export async function createUser(
    username: string,
    email: string,
    hashedEmail: string,
    password: string
): Promise<CreatedUserResult | null> {
    const query = `
      INSERT INTO users
      (username, email, hashed_email, password)
      VALUES
      ($1, $2, $3, $4)
      RETURNING id
    `;
    const values = [username, email, hashedEmail, password];
    
    try {
      const result = await queryDbConnection(query, values);
      return getOneRowResult(result);
    }

    catch (error) {
      if (error instanceof Error) {
        const customError = error as { 
          name: 'ClientError',
          code?: string,
          constraint?: string,
          message: string
        };
        const {code, constraint} = customError;
        if (code && code === '23505') {
          switch (constraint) {
            case 'users_username_key':
              customError.message = ErrorKeys.USERNAME_TAKEN;
              break;
            case 'users_email_key':
              customError.message = ErrorKeys.EMAIL_TAKEN;
              break;
            default:
              customError.message = GENERAL_SUBMISSION_ERROR;
              break;
          }
        }
      }
      throw customError;
  }
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

export async function getUserCredentials(
    identificationFormat: 'hashed_email' | 'username',
    identificationString: string
): Promise<QueryResult | null> {
    const baseQuery = `SELECT
      id,
      username,
      email,
      password,
      password_reset_token,
      password_reset_expiry,
      verified,
      role
    FROM users WHERE `;
    const condition = identificationFormat === 'hashed_email'
      ? 'hashed_email = $1'
      : 'username = $1';
    const query = baseQuery + condition;
    const values = [identificationString]
    const result = await queryDbConnection(query, values);

    try {
        return getOneRowResult(result) as UserModel;
    }
    catch (error) {
        console.error("getUserCredentials error", error)
        return null;
    }
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
): Promise<UserSession | null> {
    const query = `
      SELECT * FROM users_sessions WHERE session_token = $1
    `;

    const values = [token];
    const result = await queryDbConnection(query, values);

    try {
        return getOneRowResult(result);
    }
    catch (error) {
        console.error("getUserSession error", error)
        return null;
    }
};

export async function clearUserSession(
    userId: string,
    token: string
): Promise<Boolean | null> {
    const query = `DELETE FROM users_sessions WHERE user_id = $1 and session_token = $2`;
    const values = [userId, token];
    const result = await queryDbConnection(query, values);
    
    try {
        const deletions = getOneRowResult(result);
        return deletions !== null 
    }
    catch (error) {
        console.error("clearUserSession error", error)
        return null;
    }
}

export async function getUser(
    userId: number,
    columns: UserColumnsArray
): Promise<QueryResult | null> {
    const result = await getTable(
      'users',
      'id',
      userId,
      columns
    );

    try {
        return getOneRowResult(result);
    }
    catch (error) {
        console.error("getUserCredentials error", error)
        return null;
    }
};

export async function editUser(
    id: number,
    update: UserModel
): Promise<QueryResult | Error> {

    const updatedValues = {
        ...update,
        id: parseInt(update.id.toString(), 10),
        password_reset_expiry: update.password_reset_expiry
          ? update.password_reset_expiry instanceof Date 
            ? update.password_reset_expiry
            : convertUTCStringToDate(update.password_reset_expiry)
          : null  // Explicitly handle null values
    };

    return await editTable(
        'users',
        'id',
        id,
        updatedValues
    );
};
