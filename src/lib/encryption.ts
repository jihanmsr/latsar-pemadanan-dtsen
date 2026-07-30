import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_bytes_long_123'; // Must be 32 bytes
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt a string using AES-256-GCM.
 * Returns a payload containing the iv, authTag, and ciphertext.
 */
export function encrypt(text: string): string {
  if (!text) return text;
  
  // Create a 16-byte random Initialization Vector (IV)
  const iv = crypto.randomBytes(16);
  
  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  
  // Encrypt
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get Auth Tag
  const authTag = cipher.getAuthTag();
  
  // Combine all parts into a single string: iv.authTag.ciphertext
  return `${iv.toString('hex')}.${authTag.toString('hex')}.${encrypted}`;
}

/**
 * Decrypt a payload back to the original string.
 */
export function decrypt(encryptedPayload: string): string {
  if (!encryptedPayload || !encryptedPayload.includes('.')) return encryptedPayload;
  
  try {
    const parts = encryptedPayload.split('.');
    if (parts.length !== 3) return encryptedPayload;
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedPayload; // Return original or handle error as needed
  }
}
