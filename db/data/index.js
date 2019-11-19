const ENV = process.env.NODE_ENV || 'development';

const development = require('./dev-data');
const docker = require("./devx-data");
const test = require('./test-data');

const data = {
  development,
  test,
  production: development,
  docker
};

module.exports = data[ENV];
