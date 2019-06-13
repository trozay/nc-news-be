const { fetchAllTopics, insertTopic, removeTopic } = require('../models/topicsModels');

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => res.send({ topics }))
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  insertTopic(req.body)
    .then(topic => res.status(201).send({ topic: topic[0] }))
    .catch(next)
};

exports.deleteTopic = (req, res, next) => {
  removeTopic(req.params)
    .then(numOfDeletions => {
      if (numOfDeletions < 1) return Promise.reject({
        code: 404
      })
      res.sendStatus(204);
    })
    .catch(next);
};