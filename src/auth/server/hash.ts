import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { requireEnvVar } from "../../errors/envcheck"

const emailSalt = requireEnvVar('EMAIL_SALT');
const passwordSalt = Number(requireEnvVar('SALT_ROUNDS_PASSWORD'));

export function hashEmail(email: string) {
    const hash = crypto.createHash('sha256');
    hash.update(email + emailSalt);
    return hash.digest('hex');
}

/**
 * Hash a password.
 * @param {string} password - The plaintext password.
 * @returns {Promise<string>} - The hashed password.
 */
export async function hashPassword(stringToHash: string): Promise<string> {
    return await bcrypt.hash(stringToHash, passwordSalt);
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