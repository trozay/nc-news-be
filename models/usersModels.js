const connection = require('../db/connection');

exports.fetchAllUsers = () => {
  return connection('users').select('*');
};

exports.fetchUserById = ({ username }) => {
  return connection('users')
    .select('*')
    .where('username', username);
};

exports.removeUser = ({ username }) => {
  return connection('users')
    .where('username', username)
    .del();
};