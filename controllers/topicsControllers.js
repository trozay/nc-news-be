const { fetchAllTopics } = require('../models/topicsModels');

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => res.send({ topics }))
    .catch(next);
};