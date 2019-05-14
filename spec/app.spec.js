process.env.NODE_ENV = 'test';
const chai = require('chai')
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');
chai.use(require('chai-sorted'))

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    describe('topics', () => {
      it('GET status:200 and returns an array of topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.haveOwnProperty('topics')
            expect(body.topics).to.have.lengthOf(3);
            expect(body.topics[0]).to.eql({
              description: 'The man, the Mitch, the legend',
              slug: 'mitch',
            })
          });
      });
      describe('articles', () => {
        it('GET status:200 and returns an array of article objects', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.haveOwnProperty('comment_count');
              expect(body.articles).to.have.lengthOf(12)
            });
        });
        it('GET status:200 and returns an array of article objects that has been sorted by the query given', () => {
          return request(app)
            .get('/api/articles?sort_by=article_id')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.sorted();
            });
        });
        it('GET status:200 and returns an array of article objects that has the topic of the query given', () => {
          return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.lengthOf(1);
              expect(body.articles[0].topic).to.eql('cats')
            });
        });
        it('GET status:200 and returns an array of article objects that has the author of the query given', () => {
          return request(app)
            .get('/api/articles?author=rogersop')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.lengthOf(3);
              expect(body.articles[0].author).to.eql('rogersop')
            });
        });
        describe('articles/:article_id', () => {
          it('GET status:200 and returns an array with one article object', () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.have.lengthOf(1);
                expect(body.article[0]).to.haveOwnProperty('comment_count');
                expect(body.article[0]).to.eql({
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  topic: 'mitch',
                  author: 'butter_bridge',
                  body: 'I find this existence challenging',
                  created_at: "2018-10-15",
                  comment_count: '13',
                  votes: 100,
                });
              });
          });
          it('PATCH status:202 and returns an array with the updated object', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: -5 })
              .expect(202)
              .then(({ body }) => {
                expect(body.article).to.have.lengthOf(1);
                expect(body.article[0].votes).to.eql(95)
              })
          });
          describe('/comments', () => {
            it('GET status:200 and returns an array with comments belonging to the given article id', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.have.lengthOf(13);
                })
            });
            it('POST status:201 and returns an array with the comments added to the database', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'lurker', body: 'Great article' })
                .expect(201)
                .then(({ body }) => {
                  expect(body.article).to.have.lengthOf(1);
                  expect(body.article[0].author).to.eql('lurker');
                  expect(body.article[0].article_id).to.eql(1);
                })
            });
          });
        });
      });
      describe('comments', () => {
        describe('/:comment_id', () => {
          it('PATCH status:201 and returns an array with the comment that was updated', () => {
            return request(app)
              .patch('/api/comments/1')
              .send({ inc_votes: 5 })
              .expect(201)
              .then(({ body }) => {
                expect(body.article).to.have.lengthOf(1);
              })
          });
          it('DELETE status:204 and returns an array with the comment that was deleted', () => {
            return request(app)
              .delete('/api/comments/18')
              .expect(204)
              .then(({ body }) => {
                expect(body.article).to.eql([{
                  body: 'This morning, I showered for nine minutes.',
                  belongs_to: 'Living in the shadow of a great man',
                  created_by: 'butter_bridge',
                  votes: 16,
                  created_at: 975242163389,
                }])
              })
          });
        });
      });
    });
  });
  describe('errors', () => {
    it('returns 404 when given a bad path', () => {
      return request(app)
        .get('/dgdgfd')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('Route Not Found')
        })
    });
    it('returns 404 when given a bad path', () => {
      return request(app)
        .get('/dg463d!')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('Route Not Found')
        })
    });
  });
});
