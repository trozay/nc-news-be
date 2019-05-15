const { fetchAllArticles, fetchArticleById, updateArticleById, fetchCommentsByArticleId, inserCommentByArticleId } = require('../models/articlesModels');

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      if (articles.length === 0) return Promise.reject({ code: 400 });
      res.send({ articles });
    })
    .catch(err => next(err));
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      if (article.length === 0) return Promise.reject({ code: 400 });
      res.send({ article })
    })
    .catch(err => next(err));
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(article => {
      res.status(202).send({ article })
    })
    .catch(err => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then(articles => {
      if (articles.length === 0) return Promise.reject({ code: 400 });
      res.send({ articles })
    })
    .catch(err => next(err));
};

exports.postCommentByArticleId = (req, res, next) => {
  inserCommentByArticleId(req.params, req.body)
    .then(article => {
      res.status(201).send({ article })
    })
    .catch(err => next(err));
};