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
    describe('PageNotFound', () => {
      it('returns 404 when given a bad path', () => {
        return request(app)
          .get('/dgdgfd')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Route Not Found')
          })
      });
    });
    describe('MethodNotAllowed', () => {
      it('PUT status:405 when given a bad method', () => {
        return request(app)
          .put('/api')
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed');
          });
      });
    });
    describe('topics', () => {
      describe('MethodNotAllowed', () => {
        it('returns 405 when given a bad method', () => {
          return request(app)
            .put('/api/topics')
            .send({
              topic: 'new topic'
            })
            .expect(405)
            .then(({
              body
            }) => {
              expect(body.msg).to.to.eql('Method Not Allowed');
            });
        });
      });
      it('GET status:200 - returns an array of topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body).to.haveOwnProperty('topics')
            expect(body.topics).to.have.lengthOf(3);
            expect(body.topics[0]).to.eql({
              description: 'The man, the Mitch, the legend',
              slug: 'mitch',
            })
          });
      });
      it('POST status:201 - returns an object of the topic that was created', () => {
        return request(app)
          .post('/api/topics')
          .send({
            slug: 'coding',
            description: 'What computers need'
          })
          .expect(201)
          .then(({
            body
          }) => {
            expect(body.topic).to.eql({
              slug: 'coding',
              description: 'What computers need'
            });
          });
      });
      it('POST status:400 - when not given all the arguments needed', () => {
        return request(app)
          .post('/api/topics')
          .send({})
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Input cannot be null');
          });
      });
      it('DELETE status:204 - when given a topic slug to delete', () => {
        return request(app)
          .delete('/api/topics/paper')
          .expect(204)
      });
      it('DELETE status:404 - when given a valid topic slug that doesn\'t exist', () => {
        return request(app)
          .delete('/api/topics/not_valid')
          .expect(404)
      });
    });
    describe('articles', () => {
      it('GET status:200 - returns an array of article objects', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles[0]).to.haveOwnProperty('comment_count');
            expect(body.articles).to.have.lengthOf(10)
          });
      });
      it('GET status:200 - returns an array of article objects that has been sorted by the query given', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.be.sorted('article_id');
          });
      });
      it('GET status:200 - returns an array of article objects that has the topic of the query given', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.have.lengthOf(1);
            expect(body.articles[0].topic).to.eql('cats')
          });
      });
      it('GET status:200 - returns an array of article objects that has the author of the query given', () => {
        return request(app)
          .get('/api/articles?author=rogersop')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.have.lengthOf(3);
            expect(body.articles[0].author).to.eql('rogersop')
          });
      });
      it('GET status:200 - returns an array of article objects starting from the page specified and only the limit amount', () => {
        return request(app)
          .get('/api/articles?limit=3&p=3')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.have.lengthOf(3);
            expect(body.articles).to.eql([{
              article_id: 7,
              title: 'Z',
              topic: 'mitch',
              author: 'icellusedkars',
              votes: 0,
              created_at: "1994-11-21T00:00:00.000Z",
              comment_count: "0"
            },
            {
              article_id: 8,
              title: 'Does Mitch predate civilisation?',
              topic: 'mitch',
              author: 'icellusedkars',
              votes: 0,
              created_at: "1990-11-22T00:00:00.000Z",
              comment_count: "0"
            },
            {
              article_id: 9,
              title: "They're not exactly dogs, are they?",
              topic: 'mitch',
              author: 'butter_bridge',
              votes: 0,
              created_at: "1986-11-23T00:00:00.000Z",
              comment_count: "2"
            }
            ])
          });
      });
      it('POST status:201 - returns an object with the article that was created', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'A new article',
            body: 'This is a brand new article i\'m going to post',
            topic: 'paper',
            author: 'lurker'
          })
          .expect(201)
          .then(({
            body
          }) => {
            expect(body.article).to.eql({
              article_id: 13,
              title: 'A new article',
              body: 'This is a brand new article i\'m going to post',
              topic: 'paper',
              votes: 0,
              author: 'lurker',
              created_at: '2019-06-12T23:00:00.000Z'
            })
          });
      });
      it('POST status:400 - returns an Invalid Input when not given all the arguments to insert', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'A new article',
            topic: 'paper',
            author: 'lurker'
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Input cannot be null');
          });
      });
      it('PUT status:405 - returns Method Not Allowed', () => {
        return request(app)
          .put('/api/articles')
          .send({
            article: 'new article'
          })
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed');
          });
      });
      describe('Bad querys', () => {
        describe('Column Does not exist', () => {
          it('GET status:400 - returns Column does not exist', () => {
            return request(app)
              .get('/api/articles?sort_by=length')
              .expect(400)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Column Not Defined');
              });
          });
        });
        describe('Topic/Author given is not in the database', () => {
          it('GET status:400 - returns Not Found', () => {
            return request(app)
              .get('/api/articles?author=not_a_valid_username')
              .expect(404)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Not Found');
              });
          });
          it('GET status:404 - returns Not Found', () => {
            return request(app)
              .get('/api/articles?topic=not_a_valid_topic')
              .expect(404)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Not Found');
              });
          });
        });
      });
      describe('articles/:article_id', () => {
        it('GET status:200 and returns an array with one article object', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({
              body
            }) => {
              expect(body.article).to.haveOwnProperty('comment_count');
              expect(body.article).to.eql({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: "2018-11-15T00:00:00.000Z",
                comment_count: '13',
                votes: 100,
              });
            });
        });
        it('PATCH status:200 and returns an array with the updated object', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({
              inc_votes: -5
            })
            .expect(200)
            .then(({
              body
            }) => {
              expect(body.article.votes).to.eql(95)
            })
        });
        it('DELETE status:204', () => {
          return request(app)
            .delete('/api/articles/1')
            .expect(204)
        });
        describe('Invalid article ids', () => {
          it('GET status:400 - returns Not Found when passed an invalid id', () => {
            return request(app)
              .get('/api/articles/invalid_id')
              .expect(400)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Invalid Input');
              });
          });
          it('GET status:404 - returns Not Found when passed a valid id that doesn\'t exist', () => {
            return request(app)
              .get('/api/articles/9999')
              .expect(404)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Not Found');
              });
          });
          it('DELETE status: 404 - when given a valid id that doesn\'t exist', () => {
            return request(app)
              .delete('/api/articles/9999')
              .expect(404)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Not Found')
              })
          });
          it('DELETE status: 400 - when given a valid id that doesn\'t exist', () => {
            return request(app)
              .delete('/api/articles/not_a_valid_id')
              .expect(400)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Invalid Input')
              })
          });
        });
        describe('Invalid increment vote object', () => {
          it('PATCH status:400 - returns Invalid Input when passed and invalid inc_votes value', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({
                inc_votes: 'invalid_inc_votes'
              })
              .expect(400)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Invalid Input');
              });
          });
          it('PATCH status:400 - return Invalid Input when passed an object with other propertys', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({
                inc_votes: 'invalid_inc_votes',
                name: 'newVote'
              })
              .expect(400)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Invalid Input');
              });
          });
        });
        describe(':article_id/comments', () => {
          it('GET status:200 and returns an array with comments belonging to the given article id', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({
                body
              }) => {
                expect(body.comments).to.have.lengthOf(10);
              })
          });
          it('GET status:200 - returns an empty array when passed a valid id that doesn\'t have any comments', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({
                body
              }) => {
                expect(body.comments).to.eql([]);
              });
          });
          it('GET status:404 - returns an empty array when passed an invalid id', () => {
            return request(app)
              .get('/api/articles/not_valid_id/comments')
              .expect(400)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Invalid Input');
              });
          });
          it('POST status:201 and returns an array with the comments added to the database', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'lurker',
                body: 'Great article'
              })
              .expect(201)
              .then(({
                body
              }) => {
                expect(body.comment.author).to.eql('lurker');
                expect(body.comment.article_id).to.eql(1);
              })
          });
          it('GET status:200 - returns an array of comments accepting page and limit querys', () => {
            return request(app)
              .get('/api/articles/1/comments?limit=3&p=3')
              .expect(200)
              .then(({
                body
              }) => {
                expect(body.comments).to.have.lengthOf(3);
                expect(body.comments).to.eql([{
                  "comment_id": 8,
                  "author": "icellusedkars",
                  "votes": 0,
                  "created_at": "2010-11-24T00:00:00.000Z",
                  "body": "Delicious crackerbreads"
                },
                {
                  "comment_id": 9,
                  "author": "icellusedkars",
                  "votes": 0,
                  "created_at": "2009-11-24T00:00:00.000Z",
                  "body": "Superficially charming"
                },
                {
                  "comment_id": 10,
                  "author": "icellusedkars",
                  "votes": 0,
                  "created_at": "2008-11-24T00:00:00.000Z",
                  "body": "git push origin master"
                }
                ]);
              });
          });
          describe('Invalid article ids', () => {
            it('GET status:400 - returns Bad Request when passed an invalid id', () => {
              return request(app)
                .get('/api/articles/invalid_id/comments')
                .expect(400)
                .then(({
                  body
                }) => {
                  expect(body.msg).to.eql('Invalid Input');
                });
            });
            it('GET status:404 - returns Not Found when passed a valid id that doesn\'t exist', () => {
              return request(app)
                .get('/api/articles/9999/comments')
                .expect(404)
                .then(({
                  body
                }) => {
                  expect(body.msg).to.eql('Not Found');
                });
            });
            it('GET status:404 - returns Column Not Defined when passed an invalid id', () => {
              return request(app)
                .get('/api/articles/invalid_id/comments?sort_by=not_a_valid_column')
                .expect(400)
                .then(({
                  body
                }) => {
                  expect(body.msg).to.eql('Column Not Defined');
                });
            });
          });
          describe('Invalid post request', () => {
            it('POST status:400 - returns Not Found when passed and invalid username', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({
                  username: 123,
                  body: 'An article'
                })
                .expect(404)
                .then(({
                  body
                }) => {
                  expect(body.msg).to.eql('Not Found');
                });
            });
            it('POST status:400 - returns Invalid Input when passed an invalid body', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({
                  username: 'lurker',
                  body: null
                })
                .expect(400)
                .then(({
                  body
                }) => {
                  expect(body.msg).to.eql('Input cannot be null');
                });
            });
          });
        });
      });
    });
    describe('comments', () => {
      describe('/:comment_id', () => {
        it('PATCH status:200 and returns an array with the comment that was updated', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              inc_votes: 5
            })
            .expect(200)
            .then(({
              body
            }) => {
              expect(body.comment.votes).to.eql(21);
            })
        });
        it('DELETE status:200', () => {
          return request(app)
            .delete('/api/comments/18')
            .expect(204)
        });
      });
      describe('Method Not Allowed', () => {
        it('PUT status:405 - returns Method Not Allowed', () => {
          return request(app)
            .put('/api/comments/1')
            .send({
              comment: 'new comment'
            })
            .expect(405)
            .then(({
              body
            }) => {
              expect(body.msg).to.eql('Method Not Allowed');
            });
        });
      });
      describe('Invalid increment vote object', () => {
        it('PATCH status:400 - returns Invalid Input when passed and invalid inc_votes value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              inc_votes: 'invalid_inc_votes'
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
        it('PATCH status:400 - return Invalid Input when passed an object with other properties', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              inc_votes: 'invalid_inc_votes',
              name: 'newVote'
            })
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
      });
      describe('Invalid comment id', () => {
        it('PATCH status:400 - returns Invalid Input when passed an invalid id', () => {
          return request(app)
            .patch('/api/comments/invalid_comment_id')
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
        it('PATCH status:404 - returns Bad Request when passed a valid id that doesn\'t exist', () => {
          return request(app)
            .patch('/api/comments/9999')
            .expect(404)
            .then(({
              body
            }) => {
              expect(body.msg).to.eql('Not Found');
            });
        });
        it('DELETE status:400 - returns Invalid Input when passed an invalid id', () => {
          return request(app)
            .delete('/api/comments/invalid_comment_id')
            .expect(400)
            .then(({
              body
            }) => {
              expect(body.msg).to.eql('Invalid Input');
            });
        });
        it('DELETE status:404 - returns Bad Request when passed a valid id that doesn\'t exist', () => {
          return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then(({
              body
            }) => {
              expect(body.msg).to.eql('Not Found');
            });
        });
      });
    });
    describe('users', () => {
      it('GET status:200 and returns an array of user objects', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.users).to.have.lengthOf(4);
          })
      });
      it('PUT status:405 - returns Method Not Allowed', () => {
        return request(app)
          .put('/api/users')
          .send({
            user: 'new user'
          })
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed');
          });
      });
      describe('/:username', () => {
        it('GET status:200 and returns an array of the user object who has the username given', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({
              body
            }) => {
              expect(body.user.username).to.eql('lurker');
            });
        });
        it('DELETE status: 204 - returns status code 204 when successfully deletes user', () => {
          return request(app)
            .delete('/api/users/lurker')
            .expect(204);
        });
        it('DELETE status: 404 - returns status 404 when passed a valid username that doesn\'t exist', () => {
          return request(app)
            .delete('/api/users/not_valid')
            .expect(404);
        });
        describe('Invalid username', () => {
          it('GET status:404 - returns Bad Request when passed an invalid username that doesn\'t exist', () => {
            return request(app)
              .get('/api/users/invalid_username')
              .expect(404)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Not Found');
              });
          });
          it('GET status:404 - returns Bad Request when passed valid a username that doesn\'t exist', () => {
            return request(app)
              .get('/api/users/99999')
              .expect(404)
              .then(({
                body
              }) => {
                expect(body.msg).to.eql('Not Found');
              });
          });
        });
      });
    });
  });
});