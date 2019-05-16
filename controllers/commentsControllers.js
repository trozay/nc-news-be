const { updateCommentById, removeCommentById } = require('../models/commentsModels');

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then(comment => {
      if (comment.length === 0) return Promise.reject({ code: 404 });
      res.status(200).send({ comment: comment[0] })
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then((numOfDeletions) => {
      if (numOfDeletions === 0) return Promise.reject({ code: 404 });
      res.sendStatus(200);
    })
    .catch(next);
};