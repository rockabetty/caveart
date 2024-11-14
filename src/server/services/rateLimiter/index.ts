const rateLimitStore: Record<string, { count: number; timestamp: number }> = {};
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;

export const rateLimiter = (ip: string) => {
  const currentTime = Date.now();
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, timestamp: currentTime };
    return true;
  }

  const { count, timestamp } = rateLimitStore[ip];

  if (currentTime - timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore[ip] = { count: 1, timestamp: currentTime };
    return true;
  }

  if (count < MAX_REQUESTS) {
    rateLimitStore[ip].count += 1;
    return true;
  }

  return false;
};