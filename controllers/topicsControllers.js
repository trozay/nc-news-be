const { fetchAllTopics, insertTopic } = require('../models/topicsModels');

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