const Group = require('../models/Group');

function notifyGroups(groups, user, message) {
  console.log("Notification about", user.username);
  for (var group of groups) {
    for (var notifiableUser of group.users) {
      if (user && notifiableUser._id.toString() !== user._id.toString()) {
        notifiableUser.notifications.push({
          userId: user._id,
          message: message
        });
      } else {
        notifiableUser.notifications.push({
          userId: null,
          message: message
        });
      }

      // notifiableUser.save();
    }
  }
}

function notifyUser(user, message) {
  user.notifications.push({
    userId: null,
    message: message
  });
}

module.exports = {
  notifyGroups,
  notifyUser
}