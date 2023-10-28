import { generateToken } from './jwt';
import { createUserSession } from '../../data/users';
import { requireEnvVar } from '../../errors/envcheck';

const authTokenName = requireEnvVar('USER_AUTH_TOKEN_NAME');
console.log(authTokenName);

export async function createUserSessionCookie ( userId: string ): string {
  console.log("Create user session cookie called");
  const {token, expirationDate} = generateToken(Number(userId));
  console.log("Token generated");
  console.log(token);
  try {
    await createUserSession(
      userId,
      token,
      expirationDate
    );
    return `${authTokenName}=${token}; HttpOnly; Path=/;  Secure; SameSite=Lax; Expires=${expirationDate.toUTCString()};`;
  } catch (err) {
    throw err
  }
}
