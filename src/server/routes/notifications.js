const User = require('../models/User'),
  auth = require('../scripts/auth'),
  geo = require('../scripts/geo'),
  notifications = require('../scripts/notifications');

const express = require("express"),
  router = express.Router(),
  ObjectId = require('mongoose').Types.ObjectId;

router.use(auth.authMiddleware);

router.post('/get', (req, res) => {
  User.findById(req.decoded.id)
    .populate('currentEvent')
    .populate({
      path: "notifications.userId",
      select: "fullname username _id phoneNumber location lastCoordinatesUpdate"
    }).lean().then((user) => {
      res.json(user.notifications);
    });

});

router.post('/notifySober', (req, res) => {
  User.findById(req.decoded.id)
    .populate({
      path: "currentEvent",
      populate: {
        path: "soberGroup",
        populate: {
          path: "users"
        }
      }
    })
    .then((user) => {
      if (!user.currentEvent) {
        res.status(400);
        res.json({message: "Event is not set"});
        return;
      }

      console.log(user);

      notifications.notifyGroups([user.currentEvent.soberGroup], user, "This user has requested your assistance.");

      res.json({message: "ok"});
    });
});

router.post('/registerFirebaseToken', (req, res) => {
  if (!req.body.firebaseToken) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }


  User.findById(req.decoded.id).then((user) => {
    user.firebaseToken = req.body.firebaseToken;
    res.json({ message: "ok" });
  });

});

module.exports = router;
