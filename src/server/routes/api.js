const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(app) {
  app.get('/api', (req, res) => {
    res.json({message: 'Backseat API'});
  });

  require('./login.js')(app);
}
