import crypto from 'crypto';

// Generate a secure random string of 64 bytes and convert to base64
const generateSecretKey = () => {
  const secret = crypto.randomBytes(64).toString('base64');
  console.log('\nGenerated JWT Secret Key:');
  console.log('------------------------');
  console.log(secret);
  console.log('\nAdd this to your .env file as:');
  console.log('JWT_SECRET=your_generated_key_here\n');
};

generateSecretKey(); 