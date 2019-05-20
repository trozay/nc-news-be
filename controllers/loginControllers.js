const { createToken } = require('../models/loginModels');

exports.getToken = (req, res, next) => {
  createToken(req.body)
    .then(token => console.log(token))
};