const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  const verifiedToken = verifyToken(token);
  
  if(!verifiedToken) {
    return next(new Error("TokenNotMatched"));
  }
  
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





// 첫 번째 코드 (문제 있는 코드):
// javascriptreq.user = verifiedToken.userId;  // userId 값만 할당 (예: 123)
// 두 번째 코드 (수정된 코드):
// javascriptreq.user = {
//   userId: verifiedToken.userId    // 객체로 감싸서 할당 (예: {userId: 123})
// };
// 차이점:

// 첫 번째 코드:

// req.user에 숫자값만 저장됨 (예: req.user = 123)
// req.user.userId로 접근하면 123.userId → undefined


// 두 번째 코드:

// req.user에 객체가 저장됨 (예: req.user = {userId: 123})
// req.user.userId로 접근하면 123 ✅



// 예시로 보면:
// javascript// 첫 번째 방식
// req.user = 123;
// console.log(req.user.userId);  // undefined (숫자에 .userId 속성 없음)

// // 두 번째 방식  
// req.user = {userId: 123};
// console.log(req.user.userId);  // 123 ✅
// post.router.js에서:
// javascriptconsole.log('토큰의 사용자 ID:', req.user?.userId);

// 첫 번째: undefined (req.user가 숫자라서)
// 두 번째: 123 (req.user.userId가 존재)

// 이게 바로 undefined가 나오는 이유입니다!