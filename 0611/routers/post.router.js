const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";
const authenticateToken = require("../middleware/authenticate-middleware");
const { prisma } = require("../utils/prisma/index.js");
const bcrypt = require("bcrypt");
const { signUpValidator, handleValidationResult, loginValidator } = require("../middleware/validation-result-handler.js")

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
router.get("/:postId", async (req, res, next) => {
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
router.post("/", authenticateToken, async (req, res, next) => {

  const { title, content } = req.body;
  const userId = req.user;

  try {

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        User: {
          connect: { userId: Number(userId) }
        }
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

//게시글 수정_사용자 상관없이
// router.put("/:id",authenticateToken, async (req, res, next) => {
//   const id = Number(req.params.id);
//   const { title, content } = req.body;

//   try {

//     const existPost = await prisma.post.findUnique({
//       where: { postId: id }
//     });

//     if (!existPost) {
//       return res.status(404).send({
//         message: "게시글이 존재하지 않습니다."
//       });
//     }

//     //------authenticateToken---------
//     if (existPost.userId !== req.user.userId) {
//       return res.status(403).send({
//         message: "본인이 작성한 게시글만 수정할 수 있습니다."
//       });
//     }
//     //------authenticateToken---------

//     const post = await prisma.post.update({
//       where: { postId: id },
//       data: {
//         title,
//         content
//       }
//     });

//     res.send(post);
//   } catch (e) {
//     console.error(e);
//     return res.status(500).send({
//       message: "서버 에러",
//       error: e.message
//     })
//   }

// });





router.put("/:postId", authenticateToken, async (req, res, next) => {
  //-------------------작성자만 수정할 수 있게--------------------
  const { postId } = req.params;
  const { title, content } = req.body;

  console.log('게시글 ID:', postId);
  console.log('토큰의 사용자 ID:', req.user?.userId);

  try {
    const existPost = await prisma.post.findUnique({
      where: { postId : +postId }
    });

    console.log('게시글 정보:', existPost);

    if (!existPost) {
      return res.status(404).send({
        message: "게시글이 존재하지 않습니다."
      });
    }

    if (existPost.userId !== req.user.userId) {
      console.log('권한 없음: 게시글 작성자:', existPost.userId, '현재 사용자:', req.user.userId);
      return res.status(403).send({
        message: "본인이 작성한 게시글만 수정할 수 있습니다."
      });
    }

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
router.delete("/:id", async(req, res, next) => {
  const id = Number(req.params.id);

  try {
  const existPost = await prisma.post.findUnique({
    where: { postId: id }
  });

  if (!existPost) {
    return res.status(404).send({
      message: "존재하지 않는 게시글"
    })
  }

  await prisma.post.delete({
    where: { postId: id }
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