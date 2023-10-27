const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

if (!SECRET_KEY_JWT) {
  throw new Error("JWT secret key is missing from environment variables!");
}

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