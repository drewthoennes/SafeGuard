const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	deviceId: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	token: {
		type: String
	}
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);
