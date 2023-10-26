import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = process.node.salt_rounds || 10;

/**
 * Hash a password.
 * @param {string} password - The plaintext password.
 * @returns {Promise<string>} - The hashed password.
 */
export async function createHash(stringToHash: string): Promise<string> {
    return bcrypt.hash(stringToHash, SALT_ROUNDS);
}

/**
 * Compare a password to a hash.
 * @param {string} password - The plaintext password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
export async function compareHash(originalString: string, hashedString: string): Promise<boolean> {
    return bcrypt.compare(originalString, hashedString);
}

/**
 * Create a random string.
 * @returns {string} - The random string.
 */
export const createRandom = (): string => {
  return crypto.randomBytes(32).toString('hex');
}