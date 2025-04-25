import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const generateSecret = () => {
  // Generate a random 64-byte hex string
  return crypto.randomBytes(64).toString('hex');
};

const updateEnvFile = async () => {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const newSecret = generateSecret();
    
    let envContent;
    try {
      // Try to read existing .env file
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error) {
      // If file doesn't exist, start with empty string
      envContent = '';
    }

    // Check if JWT_SECRET already exists
    if (envContent.includes('JWT_SECRET=')) {
      // Replace existing JWT_SECRET
      envContent = envContent.replace(
        /JWT_SECRET=.*/,
        `JWT_SECRET=${newSecret}`
      );
    } else {
      // Add new JWT_SECRET
      envContent += `\nJWT_SECRET=${newSecret}`;
    }

    // Write back to .env file
    await fs.writeFile(envPath, envContent.trim() + '\n');

    console.log('✅ JWT secret generated successfully!');
    console.log('🔑 New JWT secret:', newSecret);
    console.log('📝 Updated .env file');
  } catch (error) {
    console.error('❌ Error updating .env file:', error);
    process.exit(1);
  }
};

// Run the script
updateEnvFile(); 