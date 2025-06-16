const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";
const authenticateToken = require("../middleware/authenticate-middleware");
const { prisma } = require("../utils/prisma/index.js");
const bcrypt = require("bcrypt");
const { postValidator, getPostValidator, handleValidationResult } = require("../middleware/validation-result-handler.js")
const checkPostOwner = require("../middleware/authorization-middleware.js");


//게시글 조회(누구나 조회가능/작성자 정보도 같이 보냄)
router.get("/", async (req, res, next) => {

  //prisma에서 한번에 조회하는 방법, include=join
  const post = await prisma.post.findMany({
    include: {
      User: {
        select: {
          userId: true,
          nickname: true
        }
      }
    },
    orderBy: {
      createdAt : "desc"
    }
  });

  res.json(post);

  if (post.length === 0) {
    return res.status(404).send({
      message: "게시글이 없습니다."
    });
  }
});


//특정 게시글 조회
//getPostValidator, handleValidationResult이게 있으면 문자열이거나 공백일때
//전체 게시글이 보이는게 맞음 >> router가 위에서부터 검사하기때문에
router.get("/:postId", getPostValidator, handleValidationResult, async (req, res, next) => {
  const {postId} = req.params;//여기서 parseInt안하고 where에서 +postId로 숫자형변환

  //User : {이게 없으면 catch에러 뜸

  try {
    const post = await prisma.post.findUnique({
      where: { postId: +postId},
      include : {
        User : {
          select : {
          userId : true,
          nickname : true
        }
        }
      }
    });

    if (!post) {
      return res.status(404).send({
        message: "게시글이 존재하지 않습니다."
      });
    }

    return res.json({ data: post });

  } catch (e) {
    console.error(e);
    return res.status(500).send({
      message: "게시글 조회 에러",
      error: e.message
    });
  }

});

//게시글 생성_로그인 된 사람만
router.post("/", authenticateToken, postValidator, handleValidationResult, async (req, res, next) => {

  const { title, content } = req.body;
  const userId = +req.user.userId;

  try {

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        userId: userId
        // User: {
        //   connect: { userId: Number(userId) }
        // }
      }
    });

    return res.send({
      message: "게시글 생성",
      newPost
    });

  } catch (e) {
    console.error(e);
    return res.status(500).send({
      message: "게시글 생성 에러",
      error: e.message
    });
  }
});



//-------------------작성자만 수정할 수 있게--------------------
router.put("/:postId", authenticateToken, postValidator, handleValidationResult, checkPostOwner, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const post = await prisma.post.update({
      where: { postId : +postId },
      data: {
        title,
        content
      }
    });

    console.log('수정 성공!', post);
    return res.send({
      message: "게시글 수정 완료",
      data: post
    });

  } catch (e) {
    console.error(e);
    return res.status(500).send({
      message: "서버 에러",
      error: e.message
    });
  }
});

//--------------------------------------

//게시글 삭제
router.delete("/:postId", authenticateToken, handleValidationResult, checkPostOwner, async(req, res, next) => {
  const { postId } = req.params;

  try {
    await prisma.post.delete({
      where: { postId: +postId }
    });

    return res.send({
      message: "게시글 삭제 완료"
    }); 

  } catch(e) {
    console.error(e);
    return res.status(500).send({
      message: "서버 에러",
      error: e.message
    });
  }
});


module.exports = router;