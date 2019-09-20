const express = require('express');
const jsonBodyParser = express.json();
const AuthService = require('./auth-service');
const UsersService = require('../users/users-service');
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
        res.json({
          id: dbUser.id,
          role: dbUser.role,
          authToken: AuthService.createJwt(sub, payload)
        });
      });
    })
    .catch(next);
});

authRouter.post('/refresh', (req, res) => {
  const sub = req.user.user_code.toString()
  const payload = { user_id: req.user.id }
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  })
})

authRouter.patch('/changepassword', jsonBodyParser, (req, res, next) => {
  const { id, password } = req.body;
  UsersService.hashPassword(password)
    .then(passwordEncoded => UsersService.updateUser(req.app.get('db'), id, {password: passwordEncoded}))
    .then(numRowsAffected => {
      res.status(202).json({message: 'Ok'})
    })
    .catch(next)
})

module.exports = authRouter;
