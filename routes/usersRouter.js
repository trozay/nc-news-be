const usersRouter = require('express').Router();
const { getAllUsers, getUserById, deleteUser } = require('../controllers/usersControllers');
const { methodNotAllowed } = require('../errors/index')

usersRouter.route('/')
  .get(getAllUsers)
  .all(methodNotAllowed);

usersRouter.route('/:username')
  .get(getUserById)
  .delete(deleteUser)
  .all(methodNotAllowed);

module.exports = usersRouter;