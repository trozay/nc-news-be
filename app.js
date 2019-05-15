const express = require('express');
const apiRouter = require('./routes/api');
const { routeNotFound, columnDoesntExist, badRequest, invalidInput, foreignKeyViolation, notNullViolation, handle500 } = require('./errors');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(columnDoesntExist);
app.use(badRequest);
app.use(invalidInput);
app.use(foreignKeyViolation);
app.use(notNullViolation);
app.use(handle500);

module.exports = app;
