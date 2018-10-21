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

  Group.findById(req.body.id)
    .populate("users", "fullname _id phoneNumber")
    .lean().exec((err, group) => {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
        return;
      }

      res.json(group);
    });
});

router.post('/addUser', (req, res) => {
  if (!req.body.groupId || !req.body.userId) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }


  Group.updateOne(
    { _id: ObjectId(req.body.groupId) },
    {
      $addToSet: {
        users: ObjectId(req.body.userId)
      }
    }
  ).then(() => {
    res.json({ 'message': 'ok' });
  });
});

router.post('/removeUser', (req, res) => {
  if (!req.body.groupId || !req.body.userId) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  Group.updateOne(
    { _id: ObjectId(req.body.groupId) },
    {
      $pullAll: {
        users: [ObjectId(req.body.userId)]
      }
    }
  ).then(() => {
    res.json({ 'message': 'ok' });
  });
});


module.exports = router;