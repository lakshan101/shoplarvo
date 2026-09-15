const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stylehub_super_secret_jwt_key_2026_fashion_shop');
        req.user = decoded; // Contains id, email, role
        return next();
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const protectOptional = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stylehub_super_secret_jwt_key_2026_fashion_shop');
        req.user = decoded;
      }
    } catch (error) {
      // Ignore token verification errors for optional routes like order placement
    }
  }
  next();
};

module.exports = { protect, protectOptional };
