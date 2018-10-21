const User = require('../models/User');
const Event = require('../models/Event');
const Group = require('../models/Group');
const auth = require('../scripts/auth');

const express = require("express"),
  router = express.Router(),
  ObjectId = require('mongoose').Types.ObjectId;

router.use(auth.authMiddleware);

router.post('/create', (req, res) => {
  if (!req.body.name
    || !req.body.fromDate
    || !req.body.toDate
    || !req.body.description
    || !req.body.location
    || !req.body.radius) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  let adminGroup = Group({ users: [req.decoded._id], type: "admin"}),
    userGroup = Group({ users: [req.decoded._id] }),
    soberGroup = Group({ users: [req.decoded._id], type: "sober"});

  adminGroup.save();
  userGroup.save();
  soberGroup.save();

  Event({
    name: req.body.name,
    fromDate: new Date(req.body.fromDate),
    toDate: new Date(req.body.toDate),
    description: req.body.description,
    location: {
      type: "Point",
      coordinates: [req.body.location[0], req.body.location[1]]
    },
    radius: +req.body.radius,

    adminGroup: adminGroup._id,
    userGroup: userGroup._id,
    soberGroup: soberGroup._id
  }).save((err, event) => {
    if (err) {
      res.status(400);
      res.json({ 'message': err });
      return;
    }

    if (event === null) {
      res.status(400);
      res.json()
    }

    res.status(200);
    res.json({
      id: event._id
    });
  });
});


router.post('/getById', (req, res) => {
  if (!req.body.id) {

    res.status(400);
    res.json({ 'message': 'Missing required fields' });
    return;
  }

  Event.findById(req.body.id)
    .populate({
      path: "adminGroup",
      populate: {
        path: "users",
        select: "fullname username _id"
      }
    })
    .populate({
      path: "userGroup",
      populate: {
        path: "users",
        select: "fullname username _id"
      }
    })
    .populate({
      path: "soberGroup",
      populate: {
        path: "users",
        select: "fullname username _id"
      }
    }).lean().exec((err, event) => {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
        return;
      }

      if (event === null) {
        res.status(404);
        res.json({ message: "Not found" });
        return;
      }

      event.admin = false;
      for (var admin of event.adminGroup.users) {
        if (admin._id.toString() === req.decoded.id) {
          event.admin = true;
        }
      }

      res.json(event);
    });
});

router.post('/getAll', (req, res) => {

  Event.find({}, "name description _id fromDate toDate location")
    .populate({
      path: "userGroup",
      populate: {
        path: "users",
        select: "_id"
      }
    })
    .populate({
      path: "soberGroup",
      populate: {
        path: "users",
        select: "_id"
      }
    })
    .lean().exec((err, events) => {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
        return;
      }

      if (events === null) {
        res.status(404);
        res.json({ message: "Not found" });
        return;
      }

      for (var event of events) {
        event.totalUsers = event.userGroup.users.length;
        event.totalSobers = event.soberGroup.users.length;
        delete event.userGroup;
        delete event.soberGroup;
      }

      res.json(events);
    });
});


module.exports = router;