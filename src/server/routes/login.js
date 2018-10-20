const User = require('../models/User');
const auth = require('../scripts/auth');

const express = require("express"),
  router = express.Router();


router.post('/register', (req, res) => {
  if (!req.body.fullname 
    || !req.body.username 
    || !req.body.password 
    || !req.body.phoneNumber) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  User.findOne({
    $or: [
      { username: req.body.username }
    ]
  }, (err, user) => {
    if (err) {
      res.status(400);
      res.json({ 'message': 'Error registering user' });
      return;
    }
    else if (user !== null) {
      res.status(400);
      res.json({ 'message': 'An account with that username already exists' });
      return;
    }

    User({
      fullname: req.body.fullname,
      username: req.body.username,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
    }).save((err, user) => {
      if (err) {
        res.status(400);
        res.json({ 'message': 'Error registering user' });
        console.error(err);
        return;
      }

      let token = auth.issueToken(req, user);

      user.save((err) => {
        if (err) {
          res.status(400);
          res.json({ 'message': err });
          return;
        }

        res.json({ 'message': 'Token generated', 'token': token });
      });
    });
  });
});

router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  console.log(req.body);

  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400);
      res.json({ 'message': err });
      return;
    }
    else if (!user || user === null) {
      res.status(400);
      res.json({ 'message': 'No user found with those credentials' });
      return;
    }

    if (!user.password) {
      res.status(400);
      res.json({ 'message': 'User is missing token (push to login)' });
      return;
    }

    if (user.password !== req.body.password) {
      res.status(400);
      res.json({ 'message': 'Incorrect password' });
      return;
    }

    let token = auth.issueToken(req, user);

    user.save((err) => {
      if (err) {
        res.status(400);
        res.json({ 'message': 'Error generating new token' });
        return;
      }

      res.json({ 'message': 'Token generated', 'token': token });
    });

    return;
  });
});

module.exports = router;
