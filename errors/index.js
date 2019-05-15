exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.columnDoesntExist = (err, req, res, next) => {
  if (err.code === '42703') {
    res.status(400).send({ msg: 'Column does not exist' });
  } else next(err);
};

exports.badRequest = (err, req, res, next) => {
  if (err.code === 400) {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
};

exports.invalidInput = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid Input' })
  } else next(err);
};

exports.foreignKeyViolation = (err, req, res, next) => {
  if (err.code === '23503') {
    res.status(400).send({ msg: 'Foreign Key Violation' });
  } else next(err);
};

exports.notNullViolation = (err, req, res, next) => {
  if (err.code === '23502') {
    res.status(400).send({ msg: 'Input Cannot Be Null' })
  }
};
exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
