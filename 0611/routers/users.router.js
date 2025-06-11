const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";

const authenticateToken = require("../middleware/authenticate-middleware")

// let sessionStore = {};


// router.get("/set-session", (req, res) => {
//   console.log(req.session);
//   if(!req.session.users) {
//     //처음 들어온 사람
//     req.session.users = 1;
//   } else {
//     req.session.users += 1;
//   }
//   res.send({
//     "접속유저수" : req.session.users
//   })
// });


router.get('/login', (req, res, next) => {

  //디비에 데이터 없어서 임시 데이터
  const user = {
    id: 1,
    username: "분모재",
    role: "user"
  }

  //비밀번호가 다르다 조건
  // next(new Error("password!"));


  //노드에서 토큰 발행
  const token = jwt.sign(user, SECRET_KEY, {
    expiresIn : '5h'
  });

  console.log(token);

  return res.json({
    token
  })
});

//토큰 검증
//함수가 있으면 콜백함수보다 먼저 실행된다
//로그인이 되어있는걸 가정하에 콜백함수 실행
router.get("/user", authenticateToken, (req, res, next) => {
  console.log(req.user);
  next(new Error("password"));
  res.send("!!")
});






// 코드가 왜 토큰값으로 바로 보이는지 몰겟네
// function authenticateToken(req, res){
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   //검증 하려고 하는 토큰값, 시크릿키
//   const user = jwt.verify(token, SECRET_KEY);
//   console.log(user);
// }








router.get("/set-cookie", (req, res) => {
  res.cookie("login", "true");
  return res.send("cookie set");
});

//브라우저에 있는 쿠키를 가져오기(서버가 아닌 브라우저에 있는거라 들어와야됨 => req)
router.get("/get-cookie", (req, res) => {
  const cookies = req.cookies;
  return res.json({
    cookies
  })
});

module.exports = router;