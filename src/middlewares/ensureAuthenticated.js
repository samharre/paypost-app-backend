const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header is not present.' });
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).send({ error: 'Authorization header must start with "Bearer".' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Token invalid.' })
  }
};

module.exports = ensureAuthenticated;