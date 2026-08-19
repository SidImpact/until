import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-for-dev-only-do-not-use-in-prod';

export function encryptContent(text: string): string {
  if (!text) return '';
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decryptContent(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed');
    return 'Error decrypting content.';
  }
}

export function hashContent(text: string): string {
  if (!text) return '';
  return CryptoJS.SHA256(text).toString();
}
