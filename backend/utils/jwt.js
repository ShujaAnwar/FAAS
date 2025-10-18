const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-in-production';

class JWTUtil {
  // Generate token
  static generateToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  // Verify token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Decode token without verification (for inspection)
  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTUtil;