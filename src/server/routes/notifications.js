const User = require('../models/User'),
  auth = require('../scripts/auth'),
  geo = require('../scripts/geo');

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

module.exports = router;
