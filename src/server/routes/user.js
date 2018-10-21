const User = require('../models/User');
const Event = require('../models/Event');
const Group = require('../models/Group');
const auth = require('../scripts/auth');

const express = require("express"),
  router = express.Router(),
  ObjectId = require('mongoose').Types.ObjectId;

router.use(auth.authMiddleware);

router.post('/getById', (req, res) => {
  if (!req.body.id) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  User.findById(req.body.id, "fullname username _id phoneNumber location lastCoordinatesUpdate")
    .lean().exec((err, user) => {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
        return;
      }

      res.json(user);
    });
});

router.post('/setEvent', (req, res) => {
  if (req.body.id === undefined) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  User.findById(req.decoded.id)
    .then((user) => {
      if (req.body.id === "") {
        user.currentEvent = null;
      } else {
        user.currentEvent = ObjectId(req.body.id);
      }
      user.save();
      res.json({message: "ok"});
    });
});

router.post('/getAll', (req, res) => {

  User.find({}, "fullname _id").lean().exec((err, users) => {
    if (err) {
      res.status(400);
      res.json({ 'message': err });
      return;
    }

    res.json(users);
  });
});

router.post('/me', (req, res) => {

  User.findById(req.decoded.id, "fullname _id phoneNumber notificationGroups currentEvent notifications")
  .populate("notifications.userId")
    .lean().exec((err, user) => {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
        return;
      }

      res.json(user);
    });
});

module.exports = router;