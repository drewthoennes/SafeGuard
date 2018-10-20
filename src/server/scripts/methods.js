const User = require('../models/User');
const randToken = require('random-token');

function generateToken() {
  return randToken(16);
}

function authenticate(callback) {
  
}

module.exports = {
  generateToken: generateToken
}
