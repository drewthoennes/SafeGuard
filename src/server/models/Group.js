const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GroupSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  type: {
    type: String,
    required: true,
    default: "dummy"
  }
}, { collection: 'groups' });

module.exports = mongoose.model('Group', GroupSchema);
