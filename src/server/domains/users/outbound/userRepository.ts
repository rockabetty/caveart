import {queryDbConnection,
 editTable,
  getTable, 
  getOneRowResult } from '../../../sql-helpers/queryFunctions';
import { convertUTCStringToDate } from '../../../services/timestamps';
import { QueryResult } from 'pg';
import { ErrorKeys, ClientError } from '../errors.types';
import {
  UserSession,
  CreatedUserResult,
  UserColumnsArray,
  PasswordResetCredentials,
  UserCredentials,
  User,
} from '../user.types';
import { GenericStringMap } from '../../../sql-helpers/queryFunctions'

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

  catch (error: any) {
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
};

export async function getUserCredentials(
  identificationFormat: 'hashed_email' | 'username',
  identificationString: string
): Promise<UserCredentials | null> {
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
  const result: QueryResult<UserCredentials> = await queryDbConnection(query, values);
  try {
    return getOneRowResult(result) as UserCredentials | null
  } catch (error: any) {
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
    console.error("getPasswordResetCredentials error", error);
    throw error;
  }
};

export async function createUserSession(
  userId: string,
  token: string,
  expirationDate: Date
): Promise<UserSession | null> {
  const query = `
    INSERT INTO users_sessions
    (user_id, session_token, expiration_date)
    VALUES
    ($1, $2, $3)
    RETURNING user_id, id, session_token
  `;
  const values = [userId, token, expirationDate];

  try {
    const result: QueryResult<UserSession> = await queryDbConnection(query, values);
    return getOneRowResult(result);
  } catch (error: any) {
    console.error("Create user session error", error);
    throw error;
  }
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
  
  try {
    const deletions = result.rowCount;
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
): Promise<User | null> {

  const result: QueryResult<User> = await getTable(
    'users',
    'id',
    userId,
    columns
  );

  try {
    return getOneRowResult(result) as User | null
  } catch (error: any) {
    throw error;
  }
};

export async function editUser(
  id: number,
  update: User
): Promise<QueryResult | null> {
  if (!update.id) {
    throw new Error();
    console.error('no update id for editUser')
  }
  
  const updatedValues: GenericStringMap = {
    ...update,
    id: parseInt(update.id.toString(), 10),
    password_reset_expiry: update.password_reset_expiry
      ? update.password_reset_expiry instanceof Date 
        ? update.password_reset_expiry
        : convertUTCStringToDate(update.password_reset_expiry)
      : null 
  };

  try {
    return await editTable(
      'users',
      'id',
      id,
      updatedValues
    );
  } catch (error: any) {
    console.error("editUser error", error);
    throw error;
  }
};
