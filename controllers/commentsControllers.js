const { updateCommentById, removeCommentById } = require('../models/commentsModels');

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then(comment => {
      if (comment.length === 0) return Promise.reject({ code: 400 });
      res.status(201).send({ comment })
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then((numOfDeletions) => {
      res.sendStatus(204);
    })
    .catch(next);
};