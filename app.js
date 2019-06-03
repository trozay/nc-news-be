const express = require('express');
var cors = require('cors')
const apiRouter = require('./routes/api');
const { routeNotFound, notFound, invalidInput, handle500 } = require('./errors');

const app = express();

app.use(cors())
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(invalidInput);
app.use(notFound);
app.use(handle500);

module.exports = app;
