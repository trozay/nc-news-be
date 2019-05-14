const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const topicsRouter = require('./topicsRouter');

apiRouter
  .route('/')
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;
