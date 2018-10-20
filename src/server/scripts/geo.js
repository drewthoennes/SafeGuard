const notifications = require('./notifications');

// https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function haversineDistance(coords1, coords2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  let lon1 = coords1[0];
  let lat1 = coords1[1];

  let lon2 = coords2[0];
  let lat2 = coords2[1];

  let R = 6371000; // km

  let x1 = lat2 - lat1;
  let dLat = toRad(x1);
  let x2 = lon2 - lon1;
  let dLon = toRad(x2)
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  return d;
}

function checkPosition(user, event) {
  let distance = haversineDistance(user.location.coordinates, event.location.coordinates);
  // console.log(distance, event.radius);
  if (distance > event.radius) {
    user.tracking = false;
    notifications.notifyUser(user, "You have left the event area. Your friends were notified.");
    notifications.notifyGroups(user.notificationGroups, user, "Following friend has left the event");
  }
}

module.exports = {
  checkPosition
}