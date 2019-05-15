const apiRouter = require('express').Router();
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const { getAllEndPoints } = require('../controllers/apiControllers');
const { methodNotAllowed } = require('../errors');

apiRouter
  .route('/')
  .get(getAllEndPoints)
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
