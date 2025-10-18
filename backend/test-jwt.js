require('dotenv').config();
const JWTUtil = require('./utils/jwt');

// Test JWT functionality
function testJWT() {
  try {
    console.log('🔐 Testing JWT Configuration...');
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'NOT SET');
    
    // Test token generation
    const testPayload = { userId: 'test123', username: 'testuser' };
    const token = JWTUtil.generateToken(testPayload);
    console.log('✅ Token generated successfully');
    console.log('Token:', token);
    
    // Test token verification
    const decoded = JWTUtil.verifyToken(token);
    console.log('✅ Token verified successfully');
    console.log('Decoded:', decoded);
    
    console.log('🎉 JWT setup is working correctly!');
  } catch (error) {
    console.error('❌ JWT test failed:', error.message);
  }
}

testJWT();