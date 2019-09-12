const express = require('express');
const jsonBodyParser = express.json();
const AuthService = require('./auth-service');
const { requireAuth } = require('../utils/jwt-auth');

const authRouter = express.Router();

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { user_code, password } = req.body;
  const loginUser = { user_code, password };
  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });

  AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_code)
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect user_code or password'
        });
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then(compareMatch => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'Incorrect user_code or password'
          });
        const sub = dbUser.user_code.toString();
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload)
        });
      });
    })
    .catch(next);
});

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_code
  const payload = { user_id: req.user.id }
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  })
})

module.exports = authRouter;
