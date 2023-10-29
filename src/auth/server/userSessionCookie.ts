import { generateToken } from './jwt';
import { createUserSession } from '../../data/users';
import { USER_AUTH_TOKEN_NAME } from '../../../constants';

export async function createUserSessionCookie ( userId: string ): string {
  const {token, expirationDate} = generateToken(Number(userId));
  try {
    await createUserSession(
      userId,
      token,
      expirationDate
    );
    return `${USER_AUTH_TOKEN_NAME}=${token}; HttpOnly; Path=/;  Secure; SameSite=Lax; Expires=${expirationDate.toUTCString()};`;
  } catch (err) {
    throw err
  }
}
