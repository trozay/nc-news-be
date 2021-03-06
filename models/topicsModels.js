const connection = require('../db/connection');

exports.fetchAllTopics = () => {
  return connection.select('*').from('topics');
};

exports.insertTopic = ({ slug, description }) => {
  return connection('topics').insert({ slug, description })
    .returning('*');
};

exports.removeTopic = ({ slug }) => {
  return connection('topics')
    .where({ slug })
    .del()
};