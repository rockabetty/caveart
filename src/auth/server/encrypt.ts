import crypto from 'crypto';
import { requireEnvVar } from '../../errors/envcheck'

const ENCRYPTION_KEY_32_BYTE = requireEnvVar('ENCRYPTION_KEY_32_BYTE');

function getEncryptionKey() {
  return Buffer.from(ENCRYPTION_KEY_32_BYTE as string, 'hex');
}

const IV_LENGTH = 16;

export function encrypt(text: string): string {    
    const ENCRYPTION_KEY_32_BYTE = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY_32_BYTE, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    const ENCRYPTION_KEY_32_BYTE = getEncryptionKey();
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY_32_BYTE, iv);

    return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString('utf8');
}