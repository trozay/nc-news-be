# Northcoders News API

This is an api project I built, that gives information, I have inserted into a database. The available end points are articles, topics, users, articles/comments, comments/comment_id. The relevant end points also accept queries to sort by any available column, asc/desc, filter down to articles written by a specific author, after or before a date etc. My api is a RESTful server, allowing the user to create,read, update and delete files.

# Installing

A step by step series of examples that tell you how to get my development env running

Install express for the servers and mocha/chai for testing.
```
npm i express mocha chai
```
Install postgres for the databases.
```
npm i pg
```
We also need supertest to test out routers and endpoints.
```
npm i supertest -D
```
Nodemon will update your server every time you save your file instead of restarting the server
```
npm i nodemon -D
```

# Running the tests

Run all tests available: these tests a variety of different end points and make sure the correct information is given back, there are also error handling tests on each endpoint dealing with a variety of different things that can go wrong.
```
run npm test
```

How to start server
```
run npm dev -- nodemon listen.js
```

# Deployment

Refer to the hosting.md file to see how to deploy this server on heroku.

# Built With

[Express](https://expressjs.com/) - API Framework
[Supertest](https://www.npmjs.com/package/supertest) - Test Library
[Knex](https://knexjs.org/) - Query Builder Framework
