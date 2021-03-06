const { convertSingleTimeStamp } = require('../utils/utils');

exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').references('users.username').notNullable();
    commentsTable.integer('article_id').references('articles.article_id').notNullable().onDelete('cascade');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.date('created_at').defaultTo(convertSingleTimeStamp(Date.now()));
    commentsTable.string('body', 500).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
