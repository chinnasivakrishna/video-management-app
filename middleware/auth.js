const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Check for token in different places
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Check cookies if no token in header
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check localStorage backup
    if (!token && req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    if (!token) {
      console.log('No token found in request'); // Debug log
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('Token verified, user:', decoded); // Debug log
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError); // Debug log
      if (verifyError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      throw verifyError;
    }
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug log
    res.status(401).json({ message: 'Token is not valid' });
  }
};
