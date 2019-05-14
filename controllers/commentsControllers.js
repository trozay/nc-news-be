const { updateCommentById, removeCommentById } = require('../models/commentsModels');

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then(article => res.status(201).send({ article }))
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then(article => res.status(204).send({ article }))
    .catch(next);
};