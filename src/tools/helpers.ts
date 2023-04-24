const crypto = require('crypto');

export default function generateId() {
  const buffer = crypto.randomBytes(8);
  return buffer.toString('hex');
}
