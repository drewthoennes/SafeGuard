const express = require("express"),
  router = express.Router(),
  ObjectId = require('mongoose').Types.ObjectId;


router.get('/', (req, res) => {
  res.json({ message: 'Backseat API' });
});

const loginRouter = require('./login'),
  eventRouter = require('./event'),
  trackRouter = require('./track'),
  notificationsRouter = require('./notifications'),
  userRouter = require('./user');
  groupRouter = require('./group');

router.use(loginRouter);
router.use("/event", eventRouter);
router.use("/track", trackRouter);
router.use("/notifications", notificationsRouter);
router.use("/user", userRouter);
router.use("/group", groupRouter);

module.exports = router;