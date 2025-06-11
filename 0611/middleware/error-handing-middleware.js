module.exports = function (err, req, res, next) {
  // console.error(err.message+"123");
  switch(err.message) {
    case "password" :  
    return res.status(400).send({
      errorMessage : "패스워드 불일치"
    })

    case "ExistEmail" : return res.status(400).send({
      errorMessage : "가입된 이메일 존재"
    })

    case "Forbidden" : return res.status(404).send({
      errorMessage: "접근 권한이 없습니다"
    })

    case "UserNotFound" :
    case "Need login" :
    case "accessTokenNotMatched" : 
      return res.status(401).send({
        errorMessage: "로그인을 해주세요"
      });
  }
}