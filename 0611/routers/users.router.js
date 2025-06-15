const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";
const authenticateToken = require("../middleware/authenticate-middleware");
const { prisma } = require("../utils/prisma/index.js");
const bcrypt = require("bcrypt");
const { signUpValidator, handleValidationResult, loginValidator } = require("../middleware/validation-result-handler.js")


/**
 * 1. 이메일, 비밀번호, 닉네임 입력이 정확하게 왔는지 검증
 * 2. 비밀번호 6글자 이상
 * 3. 이메일이 중복이 있는지 확인
 * 4. 데이터 베이스에 저장
 */



//signUpValidator여기서 에러가 발생하면 handleValidationResult여기서 검증
router.post("/sign-up", signUpValidator, handleValidationResult, async (req, res, next) => {

  //입력 오류가 없는 경우
  const { email, password, nickname } = req.body;


  try {
    //3. 이메일 중복_prisma 접속
    const user = await prisma.users.findFirst({
      where: { email }
    });

    if (user) {
      return next(new Error("ExistEmail"));

    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    //비밀번호를 저장하기 전에 암호화
    const bcryptPassword = await bcrypt.hash(
      password,
      salt
    );//salt를 써서 hash고정값이 아닌 실행할때마다 바껴서 암호가 더 강화됨

    //4. 데이터 베이스에 저장
    await prisma.users.create({
      data: {
        email,
        password: bcryptPassword,
        nickname
      }
    });

    return res.json({
      message: "회원가입 성공"
    });
  } catch (e) {
    console.error(e);
    return next(new Error("DataBaseError"));
  }

});


/**
 * 로그인 API
 * 1. 이메일, 비밀번호 입력 여부 확인
 * 2. 이메일에 해당하는 사용자 찾기
 * 3. 사용자 존재 여부
 * 4. 비밀번호 일치 여부 확인
 * 5. JWT 토큰 발급
 * 6. 생성된 데이터를 전달
 */
router.post('/login', loginValidator, handleValidationResult, async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({
    where: { email }
  });

  console.log('user:', user); // 어떤 값이 나오는지 확인

  if (!user) {
    //유저가 없는 경우
    return next(new Error("UserNotFound"));
  }

  //사용자가 있음
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    return next(new Error("password"));
  }

  const token = jwt.sign({
    userId: user.userId
  }, SECRET_KEY, {
    expiresIn: "12h"
  });
  return res.status(200).send({
    token
  });

});


//토큰 검증
//함수가 있으면 콜백함수보다 먼저 실행된다
//로그인이 되어있는걸 가정하에 콜백함수 실행
// router.get("/user", authenticateToken, (req, res, next) => {
//   console.log(req.user);
//   next(new Error("password"));
//   res.send("!!")
// });


module.exports = router;