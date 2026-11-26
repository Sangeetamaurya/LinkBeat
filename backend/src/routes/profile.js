const express = require('express');
const { HttpError } = require('../utils/errors');
const { usernameError, nameError, cleanGenres, avatarError } = require('../utils/validators');
const { publicUser } = require('./auth');

function createProfileRouter({ store, auth }) {
  const router = express.Router();
  router.use(auth.required);

  // save name / username / genres / photo (any of them)
  router.put('/', (req, res) => {
    const body = req.body || {};
    const user = req.user;

    if (body.name !== undefined) {
      const problem = nameError(body.name);
      if (problem) throw new HttpError(400, problem);
    }
    if (body.username !== undefined) {
      const problem = usernameError(body.username);
      if (problem) throw new HttpError(400, problem);
      if (store.isUsernameTaken(body.username, user.account.id)) {
        throw new HttpError(409, 'That username is already taken');
      }
    }
    if (body.avatar !== undefined) {
      const problem = avatarError(body.avatar);
      if (problem) throw new HttpError(400, problem);
    }

    if (body.name !== undefined) user.account.name = body.name.trim();
    if (body.username !== undefined) store.renameUser(user, body.username);
    if (body.genres !== undefined) user.account.genres = cleanGenres(body.genres);
    if (body.avatar !== undefined) user.account.avatar = body.avatar || '';
    res.json({ user: publicUser(user) });
  });

  router.put('/avatar', (req, res) => {
    const avatar = (req.body || {}).avatar;
    const problem = avatarError(avatar);
    if (problem) throw new HttpError(400, problem);
    req.user.account.avatar = avatar || '';
    res.json({ user: publicUser(req.user) });
  });

  return router;
}

module.exports = { createProfileRouter };
