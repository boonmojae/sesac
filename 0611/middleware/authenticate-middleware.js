const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  //원래는 try를 사용하는게 맞지만 express에서 error를 처리할수 있게해서 return만 하면됨
  //return에서 에러 발생
  req.password = "1234";

  if (req.password !== "1234") {

    return next(new Error("password"));
  }

  const verifiedToken = verifyToken(token);

  if(!verifiedToken) {
    return next(new Error("Need login"));
  }

  req.user = verifiedToken;
  next();

}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch(e) {
    return false;
  }
}
