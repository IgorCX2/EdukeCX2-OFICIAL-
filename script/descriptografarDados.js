require('dotenv').config();
const crypto = require('crypto');

export function decryptData(encryptedData, cod) {
  try {
    const key = Buffer.from(cod, 'hex');
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decryptedData = decipher.update(encryptedData.data, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
}