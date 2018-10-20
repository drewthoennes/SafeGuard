const express = require("express"),
  router = express.Router(),
  ObjectId = require('mongoose').Types.ObjectId;


router.get('/', (req, res) => {
  res.json({ message: 'Backseat API' });
});

const loginRouter = require('./login'),
  eventRouter = require('./event'),
  trackRouter = require('./track');
  notificationsRouter = require('./notifications');

router.use(loginRouter);
router.use("/event", eventRouter);
router.use("/track", trackRouter);
router.use("/notifications", notificationsRouter);

module.exports = router;