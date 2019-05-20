const loginRouter = require('express').Router();
const { getToken } = require('../controllers/loginControllers');

loginRouter.route('/')
  .post(getToken)

module.exports = loginRouter;