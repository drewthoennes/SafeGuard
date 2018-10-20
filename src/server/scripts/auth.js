const jwt = require('jsonwebtoken'),
  ObjectId = require('mongoose').Types.ObjectId;



function issueToken(req, user) {
  var token = jwt.sign({
    username: user.username,
    id: user._id
  }, req.app.get('secret'), {
      expiresIn: 86400 // expires in 24 hours
    });
  return token;
}

function authMiddleware(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('secret'), function (err, decoded) {
      if (err) {
        res.status(401)
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        req.decoded._id = ObjectId(decoded.id);
        next();
      }
    });
  } else {
    res.status(401);
    return res.send({ success: false, message: 'No token provided.' });
  }
}

module.exports = {
  issueToken,
  authMiddleware
}
