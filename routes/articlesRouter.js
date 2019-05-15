const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchArticleById, getCommentsByArticleId, postCommentByArticleId } = require('../controllers/articlesControllers');
const { methodNotAllowed } = require('../errors/index');

articlesRouter.route('/')
  .get(getAllArticles)
  .all(methodNotAllowed);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(methodNotAllowed);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

module.exports = articlesRouter;