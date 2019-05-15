const { fetchAllEndPoints } = require('../models/apiModels');

exports.getAllEndPoints = (req, res, next) => {
  fetchAllEndPoints()
    .then(endpoints => res.send({ endpoints }))
    .catch(next);
};