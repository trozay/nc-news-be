const connection = require('../db/connection');

exports.fetchAllArticles = ({ sort_by = 'articles.created_at', order = 'desc', author, topic, limit = 10, p }) => {
  return connection.select('articles.*')
    .count('comments.article_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .modify(query => {
      if (author) query.where('articles.author', author);
      if (topic) query.where('articles.topic', topic);
      if (p) {
        const startingPoint = (p - 1) * limit;
        query.offset(startingPoint);
      };
    })
    .groupBy('articles.article_id')
    .limit(limit)
    .orderBy(sort_by, order)
};

exports.fetchArticleById = ({ article_id }) => {
  return connection.select('articles.article_id', 'articles.title', 'articles.body', 'articles.author', 'articles.topic', 'articles.votes', 'articles.created_at')
    .count('comments.article_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
};

exports.updateArticleById = ({ article_id }, { inc_votes }) => {
  return connection('articles')
    .where('article_id', article_id)
    .increment('votes', inc_votes || 0)
    .returning('*');
};

exports.fetchCommentsByArticleId = ({ article_id }, { sort_by = 'created_at', order = 'desc', limit = 10, p }) => {
  return connection('comments').select('comment_id', 'author', 'votes', 'created_at', 'body')
    .where('comments.article_id', article_id)
    .modify(query => {
      if (p) {
        const startingPoint = (p - 1) * limit;
        query.offset(startingPoint);
      };
    })
    .orderBy(sort_by, order)
    .limit(limit)
};

exports.insertCommentByArticleId = ({ article_id }, { username, body }) => {
  return connection('comments')
    .insert({ author: username, body, article_id })
    .returning('*');
};

exports.insertArticle = ({ article_id, author, body, title, topic }) => {
  return connection('articles')
    .insert({ article_id, author, body, title, topic })
    .returning('*');
};

exports.removeArticleById = ({ article_id }) => {
  return connection('articles')
    .where('article_id', article_id)
    .del();
};