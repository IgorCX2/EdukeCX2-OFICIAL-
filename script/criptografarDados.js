require('dotenv').config();
const crypto = require('crypto');
export function encryptData(data, cod) {
  const key = Buffer.from(cod, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    data: encryptedData,
  };
}