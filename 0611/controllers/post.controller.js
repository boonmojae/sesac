const postService = require("../service/post.service");
const PostService = require("../service/post.service");

class PostController {


  //전체 조회
async findByPosts(req, res, next) {
    try {

      const posts = await postService.findByPosts();

      return res.status(200).json({ posts });
    } catch (error) {
      next(error);
    }
  }

  //특정 조회
 async findByPost(req, res, next) {

    try {
      const postId = +req.params.postId;

      const post = await postService.findByPost(postId);

      return res.status(200).json({ post });

    } catch (error) {
      next(error);
    }
  }

  //생성
 async create(req, res, next) {
    try {
      const { title, content } = req.body;

      //토큰에서 userId 추출
      const userId = req.user.userId;

      const newPost = await postService.create(title, content, userId);

      return res.status(200).json({
        message: "게시글 생성 완료",
        newPost
      })
    } catch (error) {
      next(error);
    }
  }

  //수정
 
  async update(req, res, next) {
    try {
      const { title, content } = req.body;

      const postId = +req.params.postId;

      const userId = req.user.userId;

      const updatePost = await postService.update(title, content, postId, userId);

      return res.status(200).json({
        message: "게시글 수정 완료",
        updatePost
      });

    } catch (error) {
      next(error);
    }
  }

  //삭제
  async delete(req, res, next) {
    try {
      const postId = +req.params.postId;
      const userId = req.user.userId;

      await postService.delete(postId, userId);

      return res.status(200).json({
        message: "게시글 삭제 완료",
      });
    } catch (error) {
      next(error);
    }
  }



}

module.exports = new PostController();