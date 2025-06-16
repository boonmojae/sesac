const { body, param, validationResult } = require("express-validator");
//가져와야 라이브러리 검증이 가능


//validation function 함수를 사용하는곳 위에 있어야 된다
//signUpValidator에서 handleValidationResult로 되는 이유가 user.router.js에서 순서대로 미들웨어를 써서
exports.signUpValidator = [
  body('email')
    .isEmail().withMessage('이메일 형식이 아닙니다.')
    .notEmpty().withMessage('이메일이 없습니다.'),
  body('password')
    .isLength({ min: 6 }).withMessage('비밀번호가 6자 이하')
    .notEmpty().withMessage('비밀번호가 없습니다'),
  body('nickname')
    .notEmpty().withMessage('닉네임이 없습니다')
];


//로그인 입력 검사
exports.loginValidator = [
  body('email')
    .notEmpty().withMessage('이메일이 없습니다.')
    .isEmail().withMessage('이메일 형식이 아닙니다.'),
  body('password')
    .notEmpty().withMessage('비밀번호가 없습니다.')
];

//게시글 작성
exports.postValidator = [
  body('title')
    .notEmpty().withMessage('제목을 입력해주세요.'),
  body('content')
    .notEmpty().withMessage('내용을 입력해주세요.')
];


exports.handleValidationResult = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const extractedError = result.array().map(err => err.msg);

    // 직접 응답해서 구체적인 메시지 사용
    return res.status(400).json({
      errorMessage: extractedError[0]
    });
  }
  next();
}

//특정 게시글 조회에서 아이디 param값이 안들어왔을때
exports.getPostValidator = [
  param('postId')
    .isInt().withMessage("postId가 숫자여야함")
    .notEmpty().withMessage("postId가 필요합니다")
];

//이 코드를 사용하면 위에 signUpValidator에서 설정한 withMesage를 사용을 못하고 있음
// error미들웨어 사용 방식
// exports.handleValidationResult = (req, res, next) => {
//   const result = validationResult(req);
//   if (!result.isEmpty()) {
//     // 입력 오류가 있는 경우
//     const extractedError = result.array().map(err => err.msg);
//     console.log(extractedError);
//     return next(new Error("InputValidation"));
//   }
//   //미들웨어로 사용하기 때문에 다음으로 넘어가라고
//   next();
// }