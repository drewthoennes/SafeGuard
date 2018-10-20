const bodyParser = require('body-parser');
const User = require('../models/User');
const methods = require('../scripts/methods');

module.exports = function(app) {
  app.get('/api/register', (req, res) => {
    if (!req.query.firstname || !req.query.lastname || !req.query.deviceId || !req.query.username || !req.query.password) {
      res.status(400);
      res.json({'message': 'Missing required fields'});
      return;
    }

    User.findOne({$or: [
        {username: req.query.username}
    ]}, (err, user) => {
      if (err) {
        res.status(400);
        res.json({'message': 'Error registering user'});
        return;
      }
      else if (user !== null) {
        res.status(400);
        res.json({'message': 'An account with that username already exists'});
        return;
      }

      User({
        firstname: req.query.firstname,
        lastname: req.query.firstname,
        deviceId: req.query.deviceId,
        username: req.query.username,
        password: req.query.password,
      }).save((err, user) => {
        if (err) {
          res.status(400);
          res.json({'message': 'Error registering user'});
          return;
        }

        let token = methods.generateToken();
        user.token = token;

        user.save((err) => {
          if (err) {
            res.status(400);
            res.json({'message': err});
            return;
          }

          res.json({'message': 'Token generated', 'token': token});
        });
      });
    });
  });

  app.get('/api/login', (req, res) => {
    if (!req.query.deviceId || !req.query.username || !req.query.password) {
      res.status(400);
      res.json({'message': 'Missing required fields'});
      return;
    }

    User.findOne({deviceId: req.query.deviceId, username: req.query.username}, (err, user) => {
      if (err) {
        res.status(400);
        res.json({'message': err});
        return;
      }
      else if (!user || user === null) {
        res.status(400);
        res.json({'message': 'No user found with those credentials'});
        return;
      }

      if (!user.password) {
        res.status(400);
        res.json({'message': 'User is missing token (push to login)'});
        return;
      }

      if (user.password !== req.query.password) {
        res.status(400);
        res.json({'message': 'Incorrect password'});
        return;
      }

      let token = methods.generateToken();
      user.token = token;

      user.save((err) => {
        if (err) {
          res.status(400);
          res.json({'message': 'Error generating new token'});
          return;
        }

        res.json({'message': 'Token generated', 'token': token});
      });

      return;
    });
  });
}
