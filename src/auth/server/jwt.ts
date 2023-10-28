import { requireEnvVar } from '../../errors/envcheck'
import jwt from 'jsonwebtoken';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

export function generateToken(userId: string, durationInMilliseconds: number = 1209600 * 1000) {
  const expirationDate = new Date(Date.now() + durationInMilliseconds);
  const rightNow = Math.floor(Date.now() / 1000);
  const unixExpiration = Math.floor(expirationDate.getTime() / 1000);

  const payload = {
    sub: userId,
    iat: rightNow,
    exp: unixExpiration
  };
  
  return {
    token: jwt.sign(payload, SECRET_KEY_JWT),
    expirationDate
  };
} 