const usersRouter = require('express').Router();
const { getAllUsers, getUserById } = require('../controllers/usersControllers');
const { methodNotAllowed } = require('../errors/index')

usersRouter.route('/')
  .get(getAllUsers)
  .all(methodNotAllowed);

usersRouter.route('/:username')
  .get(getUserById)
  .all(methodNotAllowed);
module.exports = usersRouter;