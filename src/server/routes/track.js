const User = require('../models/User'),
  auth = require('../scripts/auth'),
  geo = require('../scripts/geo');

const express = require("express"),
  router = express.Router(),
  ObjectId = require('mongoose').Types.ObjectId;

router.use(auth.authMiddleware);

router.post('/update', (req, res) => {
  if (!req.body.coordinates) {
    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  User.findById(req.decoded.id)
    .populate('currentEvent')
    .populate({
      path: "notificationGroups",
      populate: {
        path: "users",
        select: "fullname username _id notifications"
      }
    }).then((user) => {

      user.location.coordinates = req.body.coordinates;
      user.lastCoordinatesUpdate = Date.now();

      res.json({message: "ok"})

      if (user.tracking && user.currentEvent) {
        geo.checkPosition(user, user.currentEvent);
      }
      user.save();
    });

});

module.exports = router;
