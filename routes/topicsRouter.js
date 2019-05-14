const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topicsControllers');

topicsRouter.route('/')
  .get(getAllTopics);


module.exports = topicsRouter;