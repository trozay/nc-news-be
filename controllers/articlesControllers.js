const { fetchAllArticles, fetchArticleById, updateArticleById, fetchCommentsByArticleId, inserCommentByArticleId } = require('../models/articlesModels');

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => res.send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => res.send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(article => res.status(202).send({ article }))
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then(articles => res.send({ articles }))
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  inserCommentByArticleId(req.params, req.body)
    .then(article => res.status(201).send({ article }))
    .catch(next);
};