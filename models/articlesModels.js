const connection = require('../db/connection');

exports.fetchAllArticles = ({ sort_by = 'articles.created_at', order = 'desc', author, topic, limit = 10, p }) => {
  return connection.select('articles.article_id', 'articles.title', 'articles.author', 'articles.topic', 'articles.votes', 'articles.created_at')
    .count('comments.article_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .modify(query => {
      if (author) query.where('articles.author', author);
      if (topic) query.where('articles.topic', topic);
      if (p) query.offset(limit)
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
    .increment('votes', inc_votes)
    .returning('*');
};

exports.fetchCommentsByArticleId = ({ article_id }, { sort_by = 'created_at', order = 'desc' }) => {
  return connection('comments').select('comment_id', 'author', 'votes', 'created_at', 'body')
    .where('comments.article_id', article_id)
    .orderBy(sort_by, order);
};

exports.inserCommentByArticleId = ({ article_id }, { username, body }) => {
  return connection('comments')
    .insert({ author: username, body: body, article_id: article_id })
    .returning('*');
};