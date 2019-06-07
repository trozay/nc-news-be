const { convertSingleTimeStamp } = require('../utils/utils');

exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id');
    articlesTable.string('title').notNullable();
    articlesTable.string('body', 2000).notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('topics.slug').notNullable();
    articlesTable.string('author').references('users.username').notNullable();
    articlesTable.datetime('created_at').defaultTo(convertSingleTimeStamp(Date.now()));
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
