const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleById,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  insertArticle,
  removeArticleById,
  fetchTotalArticlesCount,
  fetchTotalCommentsCount
} = require('../models/articlesModels');

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      if (articles.length === 0) return Promise.reject({
        code: 404
      });
      return Promise.all([articles, fetchTotalArticlesCount(req.query)])
    })
    .then(([articles, total_count]) => {
      res.send({
        total_count: `Page ${req.query.p || 1} of ${total_count[0].total_count} articles`,
        articles
      })
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then(comments => {
      return Promise.all([comments, fetchTotalCommentsCount(req.query, req.params)])
    })
    .then(([comments, total_count]) => {
      res.send({
        total_count: `Page ${req.query.p || 1} of ${total_count[0].total_count} comments`,
        comments
      })
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      if (article.length === 0) return Promise.reject({
        code: 404
      });
      res.send({
        article: article[0]
      })
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(article => {
      res.status(200).send({
        article: article[0]
      })
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  insertCommentByArticleId(req.params, req.body)
    .then(comment => {
      res.status(201).send({
        comment: comment[0]
      })
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(article => res.status(201).send({
      article: article[0]
    }))
    .catch(next)
};

exports.deleteArticleById = (req, res, next) => {
  removeArticleById(req.params)
    .then(numOfDeletions => {
      if (numOfDeletions < 1) return Promise.reject({
        code: 404
      })
      res.sendStatus(204);
    })
    .catch(next);
};