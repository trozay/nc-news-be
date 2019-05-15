const connection = require('../db/connection');

exports.fetchAllUsers = () => {
  return connection('users').select('*');
};

exports.fetchUserById = ({ username }) => {
  return connection('users')
    .select('*')
    .where('username', username);
};