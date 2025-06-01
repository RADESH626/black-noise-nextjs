const bcrypt = require('bcryptjs');

async function generateHashedPassword() {
  const password = 'admin123';
  const saltRounds = 10;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Hash validation:', isValid);
    
    return hashedPassword;
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHashedPassword();
