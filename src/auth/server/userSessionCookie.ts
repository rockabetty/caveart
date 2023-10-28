import { generateToken } from './jwt';
import { createUserSession } from '../../data/users';
import { requireEnvVar } from '../../errors/envcheck';

const AuthTokenName = requireEnvVar('USER_AUTH_TOKEN_NAME');

export const createUserSessionCookie = async ( userId: number ) => {
  const {token, expirationDate} = generateToken(userId);
  const newUserSession = await createUserSession(
    userId,
    token,
    expirationDate
  );
  return `${tokenName}=${token}; HttpOnly; Path=/;  Secure; SameSite=Lax; Expires=${expirationDate.toUTCString()};`;
}
