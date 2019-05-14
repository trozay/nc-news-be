const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchArticleById, getCommentsByArticleId, postCommentByArticleId } = require('../controllers/articlesControllers');

articlesRouter.route('/')
  .get(getAllArticles);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;