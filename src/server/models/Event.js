const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  adminGroup: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  userGroup: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  soberGroup: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  location: {
    type: { type: String, default: "Point", required: true },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  radius: { // in meters
    type: Number,
    required: true
  }
}, { collection: 'events' });

EventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Event', EventSchema);
