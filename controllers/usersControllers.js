const { fetchAllUsers, fetchUserById, removeUser } = require('../models/usersModels');

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(users => res.send({ users }))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  fetchUserById(req.params)
    .then(user => {
      if (user.length === 0) return Promise.reject({ code: 404 });
      res.send({ user: user[0] });
    })
    .catch(next);
};

exports.deleteUser = (req, res, next) => {
  removeUser(req.params)
    .then(numOfDeletions => {
      if (numOfDeletions < 1) return Promise.reject({
        code: 404
      })
      res.sendStatus(204);
    })
    .catch(next);
};