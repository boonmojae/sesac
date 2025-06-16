
const authService = require("../service/auth.service.js")

class AuthController {

  //sign
  signUp = async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;

      const newUser = await authService.signUp(email, password, nickname);

      return res.status(201).json({
        message: "회원가입 성공",
        newUser
      });
    } catch (error) {
      // Service에서 던진 에러 처리
      // if (error.message === "ExistEmail") {
      //   return res.status(409).json({
      //     message: "이미 존재하는 이메일입니다."
      //   });
      // }

      // 다른 에러들은 에러 미들웨어로 전달
      next(error);
    }
  }

  //login
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      //service에서 로그인 처리(토큰 받기)
      const token = await authService.login(email, password);

      //성공 응답
      return res.status(200).json({
        message: "로그인 성공",
        token: token
      });

    } catch (error) {
      next(error);
    }
  }

  //update
  
  //delete


}

module.exports = new AuthController();


// class AuthController {
//   signUp = async (req, res, next) => {
//     //인증, 인가, validation
//     const { email, password, nickname } = req.body;

//     const newUser = await authService.signUp(email, password, nickname);

//     return res.status(201).json({
//       message: "회원가입 성공",
//       newUser
//     });
//   }
// }

// module.exports = new AuthController();

//요청과 응답을 담당
//요청에 대한 처리는 서비스에게 위임
