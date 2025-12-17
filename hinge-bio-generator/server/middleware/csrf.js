const crypto = require('crypto');

const tokenStore = new Map();

const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    const token = generateCSRFToken();
    const sessionId = req.ip + req.get('User-Agent');
    tokenStore.set(sessionId, token);
    res.locals.csrfToken = token;
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionId = req.ip + req.get('User-Agent');
  const storedToken = tokenStore.get(sessionId);
  
  if (!token || !storedToken || token !== storedToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  tokenStore.delete(sessionId);
  next();
};

const getCSRFToken = (req, res) => {
  const token = generateCSRFToken();
  const sessionId = req.ip + req.get('User-Agent');
  tokenStore.set(sessionId, token);
  res.json({ csrfToken: token });
};

module.exports = { csrfProtection, getCSRFToken };