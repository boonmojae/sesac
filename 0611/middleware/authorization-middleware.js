const {prisma} = require("../utils/prisma/index");

module.exports = async function checkPostOwner(req, res, next) {
  const { postId } = req.params;
  const userId = req.user.userId;

  //게시글 수정에 authenticateToken 미들웨어 추가
  //userId 랑 post의 userId가 동일한지 확인
  const post = await prisma.post.findUnique({
    where: { postId: +postId }
  });

  if(!post) {
    return next(new Error("PostNotFound"));
  }

  if (post.userId !== userId) {
    return next(new Error("Forbidden"));
  }

  res.locals.post = post;//데이터를 날리지 않고 res.locals.post에 저장
  //여기를 조회하는게 데이터 베이스보다 빠르고 await접속을 줄일 수 있음
  //req가 아닌 res하는 이유
  //req는 인증 관련된걸 많이 넣어놓기 때문. user정보 아닌 데이터는 local에 담아놓는다고 생각
  next();
}