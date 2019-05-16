const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../controllers/topicsControllers');
const { methodNotAllowed } = require('../errors/index');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;