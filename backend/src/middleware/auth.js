const jwt = require('jsonwebtoken');
const { HttpError } = require('../utils/errors');

// Reads "Authorization: Bearer <token>", checks it and puts the user on req.
function createAuth({ store, secret }) {
  function read(req) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (e) {
      return null;
    }
    if (store.isRevoked(payload.jti)) return null;
    const user = store.findById(payload.sub);
    if (!user) return null;
    return { user, payload };
  }

  const required = (req, res, next) => {
    const found = read(req);
    if (!found) return next(new HttpError(401, 'Please log in again'));
    req.user = found.user;
    req.token = found.payload;
    next();
  };

  const optional = (req, res, next) => {
    const found = read(req);
    if (found) {
      req.user = found.user;
      req.token = found.payload;
    }
    next();
  };

  return { required, optional };
}

module.exports = { createAuth };
