const authRepository = require("../repository/auth.repository")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const SECRET_KEY = "sesac";

class AuthService {

  //signUp
  async signUp(email, password, nickname) {

    //입력받은 이메일을 보고 데이터베이스 이메일 값 유무 체크 
    //service에서의 에러 처리 => 에러를 발견하고 알려주는것
    const existUser = await authRepository.findByEmail(email);
    if (existUser) {
      throw new Error("ExistEmail"); 
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    //비밀번호를 저장하기 전에 암호화
    const bcryptPassword = await bcrypt.hash(
      password,
      salt
    );

    const newUser = await authRepository.createUser(email, bcryptPassword, nickname);

    return newUser; 
  }

  //login
  async login(email, password) {

    //입력받은 이메일 존재 유무 확인
    const existUser = await authRepository.findByEmail(email);

    //이메일 X
    if (!existUser) {
      throw new Error("UserNotFound");
    }

    //이메일 O, 비밀번호 X
    const verifyPassword = await bcrypt.compare(password, existUser.password);
    if (!verifyPassword) {
      throw new Error("password");
    }

    //이메일 O, 비밀번호 O
    const token = jwt.sign({
      userId: existUser.userId
    }, SECRET_KEY, {
      expiresIn: "12h"
    });

    return token;

  }

};

module.exports = new AuthService();