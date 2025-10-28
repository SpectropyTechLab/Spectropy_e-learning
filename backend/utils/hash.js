// backend/utils/hash.js
import bcrypt from 'bcrypt';

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);