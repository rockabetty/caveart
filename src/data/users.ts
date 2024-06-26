import {queryDbConnection, editTable, getTable, getOneRowResult } from './queryFunctions';
import { convertUTCStringToDate } from '../services/timestamps';
import { UserModel } from './types/models';
import { UserSession, CreatedUserResult,  UserColumnsArray, PasswordResetCredentials } from './types/users';
import { QueryResult } from 'pg';
import { ErrorKeys } from '../services/auth/types/errors';
import { ClientError } from './types/errors';

export async function createUser(
  username: string,
  email: string,
  hashedEmail: string,
  password: string
): Promise<CreatedUserResult> {
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
    const {code, constraint} = error;
    let errorMessage = ErrorKeys.GENERAL_SUBMISSION_ERROR; 
    
    if (code && code === '23505') {
      switch (constraint) {
      case 'users_username_key':
        errorMessage = ErrorKeys.USERNAME_TAKEN;
        break;
      case 'users_hashed_email_key':
        errorMessage = ErrorKeys.EMAIL_TAKEN;
        break;
      default:
        errorMessage = ErrorKeys.GENERAL_SUBMISSION_ERROR;
        break;
      }
    }
    throw new ClientError(errorMessage, code, constraint);
    }
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
): Promise<UserCredentials> {
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
    throw error;
  }
};

export async function getPasswordResetCredentials(
  identificationFormat: 'hashed_email' | 'username',
  identificationString: string
): Promise<PasswordResetCredentials> {
  const baseQuery = `SELECT
    password_reset_token,
    password_reset_expiry,
  FROM users WHERE `;
  const condition = identificationFormat === 'hashed_email'
    ? 'hashed_email = $1'
    : 'username = $1';
  const query = baseQuery + condition;
  const values = [identificationString]
  const result = await queryDbConnection(query, values);

  try {
    const credentials = getOneRowResult(result);
    if (!credentials.password_reset_token || !credentials.password_reset_expiry) {
      throw new Error("Invalid PW reset credentials");
    }
    return credentials as PasswordResetCredentials;
  }
  catch (error) {
    console.error("getPasswordResetCredentials error", error)
    throw error;
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
): Promise<UserSession> {
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
    throw error;
  }
};

export async function clearUserSession(
  userId: string,
  token: string
): Promise<Boolean> {
  const query = `DELETE FROM users_sessions WHERE user_id = $1 and session_token = $2`;
  const values = [userId, token];
  const result = await queryDbConnection(query, values);
  console.log("attempted to delete - ")
  console.log(userId)
  console.log(token)
  
  try {
    const deletions = result.rowCount;
    console.log(deletions);
    return deletions === 1; 
  }
  catch (error) {
    console.error("clearUserSession error", error)
    throw error;
  }
}

export async function getUser(
  userId: number,
  columns: UserColumnsArray
): Promise<QueryResult> {
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
    throw error;
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
