const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { asyncHandler, HttpError } = require('../utils/errors');
const { hashPassword, verifyPassword } = require('../utils/password');
const { usernameError, passwordError, nameError } = require('../utils/validators');

function publicUser(user) {
  const a = user.account;
  return { id: a.id, name: a.name, username: a.username, genres: a.genres, avatar: a.avatar };
}

function createAuthRouter({ store, auth, secret, tokenTtl, rateLimit }) {
  const router = express.Router();

  function issueToken(user) {
    return jwt.sign({ sub: user.account.id }, secret, { expiresIn: tokenTtl, jwtid: crypto.randomUUID() });
  }

  router.post(
    '/signup',
    rateLimit,
    asyncHandler(async (req, res) => {
      const { name, username, password } = req.body || {};
      const problem = nameError(name) || usernameError(username) || passwordError(password);
      if (problem) throw new HttpError(400, problem);
      if (store.isUsernameTaken(username)) throw new HttpError(409, 'That username is already taken');

      const user = store.createUser({
        name: name.trim(),
        username: username.trim(),
        passwordHash: await hashPassword(password),
      });
      res.status(201).json({ token: issueToken(user), user: publicUser(user) });
    })
  );

  router.post(
    '/login',
    rateLimit,
    asyncHandler(async (req, res) => {
      const { username, password } = req.body || {};
      if (!username || !password) throw new HttpError(400, 'Enter your username and password');
      const user = store.findByUsername(username);
      // always run the hash check, so a wrong username and a wrong password take the same time
      const ok = await verifyPassword(String(password), user ? user.account.passwordHash : 'x:y');
      if (!user || !ok) throw new HttpError(401, 'Wrong username or password');
      res.json({ token: issueToken(user), user: publicUser(user) });
    })
  );

  router.post('/logout', auth.required, (req, res) => {
    store.revokeToken(req.token.jti, req.token.exp * 1000);
    res.json({ ok: true });
  });

  router.get('/me', auth.required, (req, res) => {
    res.json({ user: publicUser(req.user) });
  });

  // is this username free? (the signed in user's own username counts as free)
  router.get('/username-available', auth.optional, (req, res) => {
    const username = String(req.query.username || '');
    const problem = usernameError(username);
    if (problem) return res.json({ available: false, reason: problem });
    const taken = store.isUsernameTaken(username, req.user ? req.user.account.id : null);
    res.json({ available: !taken, reason: taken ? 'That username is already taken' : '' });
  });

  router.post(
    '/change-password',
    auth.required,
    rateLimit,
    asyncHandler(async (req, res) => {
      const { oldPassword, newPassword } = req.body || {};
      if (!oldPassword || !(await verifyPassword(String(oldPassword), req.user.account.passwordHash))) {
        throw new HttpError(400, 'Current password is wrong');
      }
      const problem = passwordError(newPassword);
      if (problem) throw new HttpError(400, problem);
      req.user.account.passwordHash = await hashPassword(newPassword);
      res.json({ ok: true });
    })
  );

  router.delete('/account', auth.required, (req, res) => {
    store.revokeToken(req.token.jti, req.token.exp * 1000);
    store.deleteUser(req.user);
    res.json({ ok: true });
  });

  return router;
}

module.exports = { createAuthRouter, publicUser };
