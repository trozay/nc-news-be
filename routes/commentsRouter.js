const commentsRouter = require('express').Router();
const { patchCommentById, deleteCommentById } = require('../controllers/commentsControllers');
const { methodNotAllowed } = require('../errors/index');

commentsRouter.route('/')
  .all(methodNotAllowed);

commentsRouter.route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;