const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  const verifiedToken = verifyToken(token);
  
  if(!verifiedToken) {
    return next(new Error("TokenNotMatched"));
  }
  
  //req.ures = verifiedToken.userId; 로 하면 router에서 req.user로 가져올 수 있음
  //router에서 req.user.userId로 가져옴
  req.user = {
    userId: verifiedToken.userId
  };

  
  next();
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch(e) {
    return false;
  }
}
