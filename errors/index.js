exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.invalidInput = (err, req, res, next) => {
  const errorCodes400 = [400, '23502', '22P02'];
  if (errorCodes400.indexOf(err.code) !== -1) {
    res.status(400).send({ msg: 'Invalid Input' });
  } else next(err);
};

exports.notFound = (err, req, res, next) => {
  const errorCodes404 = [404, '23503', '22P02', '42703'];
  if (errorCodes404.indexOf(err.code) !== -1) {
    res.status(404).send({ msg: 'Not Found' });
  } else next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
