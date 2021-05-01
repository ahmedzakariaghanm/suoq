const jwt = require('jsonwebtoken')

exports.isAuthorized = (req,res,next) => {
    const JWTSECRET = process.env.JWTSECRET;
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(' ')[1];

      try {
        req.body.token = authorization;
        req.body.tokenData = jwt.verify(authorization, JWTSECRET);
        next();
      } catch (e) {
        return res.status(401).json({ message: 'unauthorized access', data: null });
      }
    } else {
      return res.status(401).json({ message: 'unauthorized access', data: null });
    }
}