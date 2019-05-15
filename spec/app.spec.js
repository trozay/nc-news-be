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
    it.only('GET status:200 - returns with a JSON object with all available endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).to.eql({
            "GET /api": {
              "description": "serves up a json representation of all the available endpoints of the api"
            },
            "GET /api/topics": {
              "description": "serves an array of all topics",
              "queries": [],
              "exampleResponse": {
                "topics": [{ "slug": "football", "description": "Footie!" }]
              }
            },
            "GET /api/articles": {
              "description": "serves an array of all topics",
              "queries": ["author", "topic", "sort_by", "order"],
              "exampleResponse": {
                "articles": [
                  {
                    "title": "Seafood substitutions are increasing",
                    "topic": "cooking",
                    "author": "weegembump",
                    "body": "Text from the article..",
                    "created_at": 1527695953341
                  }
                ]
              }
            }
          });
        });
    });

    describe('PageNotFound', () => {
      it('returns 404 when given a bad path', () => {
        return request(app)
          .get('/dgdgfd')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Route Not Found')
          })
      });
    });
    describe('MethodNotAllowed', () => {
      it('PUT status:405 when given a bad method', () => {
        return request(app)
          .put('/api')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.eql('Method Not Allowed');
          });
      });
    });
    describe('topics', () => {
      describe('RouteNotFound', () => {
        it('GET status:404 - returns Route Not Found', () => {
          return request(app)
            .get('/api/topics/dgdgfd')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql('Route Not Found')
            });
        });
      });
      describe('MethodNotAllowed', () => {
        it('returns 405 when given a bad method', () => {
          return request(app)
            .put('/api/topics')
            .send({ topic: 'new topic' })
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.to.eql('Method Not Allowed');
            });
        });
      });
      it('GET status:200 - returns an array of topic objects', () => {
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
    });
    describe('articles', () => {
      it('GET status:200 - returns an array of article objects', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.haveOwnProperty('comment_count');
            expect(body.articles).to.have.lengthOf(12)
          });
      });
      it('GET status:200 - returns an array of article objects that has been sorted by the query given', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sorted();
          });
      });
      it('GET status:200 - returns an array of article objects that has the topic of the query given', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(1);
            expect(body.articles[0].topic).to.eql('cats')
          });
      });
      it('GET status:200 - returns an array of article objects that has the author of the query given', () => {
        return request(app)
          .get('/api/articles?author=rogersop')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(3);
            expect(body.articles[0].author).to.eql('rogersop')
          });
      });
      it('PUT status:405 - returns Method Not Allowed', () => {
        return request(app)
          .put('/api/articles')
          .send({ article: 'new article' })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.eql('Method Not Allowed');
          });
      });
      describe('Bad querys', () => {
        describe('Column Does not exist', () => {
          it('GET status:400 - returns Column does not exist', () => {
            return request(app)
              .get('/api/articles?sort_by=length')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Column does not exist');
              });
          });
        });
        describe('Topic/Author given is not in the database', () => {
          it('GET status:400 - returns Bad Request', () => {
            return request(app)
              .get('/api/articles?author=not_a_valid_username')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Bad Request');
              });
          });
          it('GET status:400 - returns Bad Request', () => {
            return request(app)
              .get('/api/articles?topic=not_a_valid_topic')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Bad Request');
              });
          });
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
                created_at: "2018-10-14T23:00:00.000Z",
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
        describe('Invalid article ids', () => {
          it('GET status:400 - returns Invalid Input when passed an invalid id', () => {
            return request(app)
              .get('/api/articles/invalid_id')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Invalid Input');
              });
          });
          it('GET status:400 - returns Bad Request when passed a valid id that doesn\'t exist', () => {
            return request(app)
              .get('/api/articles/9999')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Bad Request');
              });
          });
        });
        describe('Invalid increment vote object', () => {
          it('PATCH status:400 - returns Invalid Input when passed and invalid inc_votes value', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: 'invalid_inc_votes' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Invalid Input');
              });
          });
          it('PATCH status:400 - return Invalid Input when passed an object with other propertys', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: 'invalid_inc_votes', name: 'newVote' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Invalid Input');
              });
          });
        });
        describe(':article_id/comments', () => {
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
          describe('Invalid article ids', () => {
            it('GET status:400 - returns Invalid Input when passed an invalid id', () => {
              return request(app)
                .get('/api/articles/invalid_id/comments')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Invalid Input');
                });
            });
            it('GET status:400 - returns Bad Request when passed a valid id that doesn\'t exist', () => {
              return request(app)
                .get('/api/articles/9999/comments')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Bad Request');
                });
            });
          });
          describe('Invalid post request', () => {
            it('POST status:400 - returns Foreign Key Violation when passed and invalid username', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 123, body: 'An article' })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Foreign Key Violation');
                });
            });
            it('POST status:400 - returns Invalid Input when passed an invalid body', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'lurker', body: null })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Input Cannot Be Null');
                });
            });
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
              expect(body.comment).to.have.lengthOf(1);
            })
        });
        it('DELETE status:204 and returns an array with the comment that was deleted', () => {
          return request(app)
            .delete('/api/comments/18')
            .expect(204)
        });
      });
      describe('Method Not Allowed', () => {
        it('PUT status:405 - returns Method Not Allowed', () => {
          return request(app)
            .put('/api/comments/1')
            .send({ comment: 'new comment' })
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.eql('Method Not Allowed');
            });
        });
      });
      describe('Invalid increment vote object', () => {
        it('PATCH status:400 - returns Invalid Input when passed and invalid inc_votes value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'invalid_inc_votes' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
        it('PATCH status:400 - return Invalid Input when passed an object with other properties', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'invalid_inc_votes', name: 'newVote' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
      });
      describe('Invalid comment id', () => {
        it('PATCH status:400 - returns Invalid Input when passed an invalid id', () => {
          return request(app)
            .patch('/api/comments/invalid_comment_id')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
        it('PATCH status:400 - returns Bad Request when passed a valid id that doesn\'t exist', () => {
          return request(app)
            .patch('/api/comments/9999')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Bad Request');
            });
        });
        it('DELETE status:400 - returns Invalid Input when passed an invalid id', () => {
          return request(app)
            .patch('/api/comments/invalid_comment_id')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
        it('DELETE status:400 - returns Bad Request when passed a valid id that doesn\'t exist', () => {
          return request(app)
            .patch('/api/comments/9999')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Bad Request');
            });
        });
        it('DELETE status:400 - returns Invalid Input when passed a invalid id ', () => {
          return request(app)
            .patch('/api/comments/invalid_comment_id')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
      });
      describe('Error deleting', () => {
        it('DELETE status:400 - returns Bad Request when passed an invalid comment id', () => {
          return request(app)
            .delete('/api/comments/invalid_comment_id');
        });
      });
    });
    describe('users', () => {
      it('GET status:200 and returns an array of user objects', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.have.lengthOf(4);
          })
      });
      it('PUT status:405 - returns Method Not Allowed', () => {
        return request(app)
          .put('/api/users')
          .send({ user: 'new user' })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.eql('Method Not Allowed');
          });
      });
      describe('/:username', () => {
        it('GET status:200 and returns an array of the user object who has the username given', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.have.lengthOf(1);
            });
        });
        describe('Invalid username', () => {
          it('GET status:400 - returns Bad Request when passed a username that doesn\'t exist', () => {
            return request(app)
              .get('/api/users/invalid_username')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql('Bad Request');
              });
          });
        });
      });
    });
  });
});
