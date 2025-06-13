const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "sesac";
const authenticateToken = require("../middleware/authenticate-middleware");
const { prisma } = require("../utils/prisma/index.js");
const bcrypt = require("bcrypt");
const { signUpValidator, handleValidationResult, loginValidator } = require("../middleware/validation-result-handler.js")

//게시글 조회
router.get("/", async (req, res, next) => {
  const post = await prisma.post.findMany();

  res.json(post);

  if (post.length === 0) {
    return res.status(404).send({
      message: "게시글이 없습니다."
    });
  }
});

//특정 게시글 조회
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const post = await prisma.post.findUnique({
      where: { postId: id }
    });

    if (!post) {
      return res.status(404).send({
        message: "게시글이 존재하지 않습니다."
      });
    }

    res.send(post);

  } catch (e) {
    console.error(e);
    return res.status(500).send({
      message: "게시글 조회 에러",
      error: e.message
    });
  }

});

//게시글 생성
router.post("/", async (req, res, next) => {
  const { title, content, userId } = req.body;

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

//게시글 수정
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

router.put("/:id", authenticateToken, async (req, res, next) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  console.log('게시글 ID:', id);
  console.log('토큰의 사용자 ID:', req.user?.userId);

  try {
    const existPost = await prisma.post.findUnique({
      where: { postId: id }
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
      where: { postId: id },
      data: {
        title,
        content
      }
    });

    console.log('수정 성공!', post);
    return res.send({
      message: "게시글 수정 완료",
      post
    });

  } catch (e) {
    console.error(e);
    return res.status(500).send({
      message: "서버 에러",
      error: e.message
    });
  }
});








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