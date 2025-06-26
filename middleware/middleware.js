
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


const authenticateToken = async (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  // Check if token is blacklisted
  // const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  // if (isBlacklisted) return res.status(401).json({ message: 'Token is blacklisted' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permission Denied. Admins Only.' });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin };
