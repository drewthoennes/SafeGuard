const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },

  currentEvent: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  notificationGroups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  tracking: {
    type: Boolean,
    default: false,
    index: true
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  lastCoordinatesUpdate: Date,

  notifications: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    message: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      default: Date.now()
    }
  }]

}, { collection: 'users' });

UserSchema.index({location: '2dsphere'});

module.exports = mongoose.model('User', UserSchema);
