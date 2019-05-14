const { articleData, topicData, userData, commentData } = require('../data/index');
const { convertTimeStamp, createRef, renameKeys, formatArr } = require('../utils/utils');
exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicData)
        .returning('*');
    })
    .then(topicRows => {
      return knex('users')
        .insert(userData)
        .returning('*');
    })
    .then(userRows => {
      const formattedArticles = convertTimeStamp(articleData);
      return knex('articles')
        .insert(formattedArticles)
        .returning('*')
    })
    .then(articleRows => {
      const objRef = createRef(articleData, 'title')
      const renamedComments = renameKeys(commentData, 'created_by', 'author');
      const newComments = renameKeys(renamedComments, 'belongs_to', 'article_id')
      const formattedComments = formatArr(newComments, objRef);
      const reformattedComments = convertTimeStamp(formattedComments);
      return knex('comments')
        .insert(reformattedComments)
        .returning('*');
    });
};
