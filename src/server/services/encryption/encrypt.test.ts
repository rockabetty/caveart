import { encrypt, decrypt } from '.'

process.env['ENCRYPTION_KEY_32_BYTE'] = 'e3decb86a5c318a0c1f182e7126849eab56c204f21201625f2482abf825548cb';

describe('Encryption and Decryption', () => {

    it('should encrypt and then decrypt to the original message', () => {
        const sampleMessage = 'diversify yo bonds';
        const encryptedMessage = encrypt(sampleMessage);
        const decryptedMessage = decrypt(encryptedMessage);

        expect(decryptedMessage).toEqual(sampleMessage);
    });
});