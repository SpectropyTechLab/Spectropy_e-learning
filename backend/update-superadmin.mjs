// backend/update-superadmin.mjs
import { hashPassword } from './utils/hash.js';

const main = async () => {
  const password = 'SpectropySuper2025!';
  const realHash = await hashPassword(password);
  
  console.log('\n✅ REAL HASH FOR "SpectropySuper2025!":\n');
  console.log(realHash);
  
  console.log('\n📋 RUN THIS IN SUPABASE SQL EDITOR:\n');
  console.log(`UPDATE users 
SET password_hash = '${realHash}'
WHERE email = 'super@lms.com';`);
};

main();