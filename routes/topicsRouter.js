const topicsRouter = require('express').Router();
const { getAllTopics, postTopic, deleteTopic } = require('../controllers/topicsControllers');
const { methodNotAllowed } = require('../errors/index');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(methodNotAllowed);

topicsRouter.route('/:slug')
  .delete(deleteTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;