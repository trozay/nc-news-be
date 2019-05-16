const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchArticleById, getCommentsByArticleId, postCommentByArticleId, postArticle, deleteArticleById } = require('../controllers/articlesControllers');
const { methodNotAllowed } = require('../errors/index');

articlesRouter.route('/')
  .get(getAllArticles)
  .post(postArticle)
  .all(methodNotAllowed);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(methodNotAllowed);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

module.exports = articlesRouter;