const postRepository = require("../repository/post.repository");
const PostRepository = require("../repository/post.repository");

class PostService {

  //게시글 생성
  async create(title, content, userId) {

    const newPost = await postRepository.createPost(title, content, userId);

    return newPost;
  }

  //전체 게시글 조회
  async findByPosts() {
    const posts = await postRepository.findAllPosts();

    return posts;
  }

  //특정 게시글 조회
  async findByPost(postId) {
    const post = await postRepository.findByPostId(postId);

    if (!post) {
      throw new Error("PostNotFound");
    }

    return post;
  }


  //게시글 수정
  async update(title, content, postId, userId) {

    const existPost = await postRepository.findByPostId(postId);

    if (!existPost) {
      throw new Error("PostNotFound");
    }

    if (existPost.userId !== userId) {
      throw new Error("Forbidden");
    }

    const updatePost = await postRepository.updatePost(title, content, postId, userId);

    return updatePost;
  }


  //게시글 삭제
  async delete(postId, userId) {
    const existPost = await postRepository.findByPostId(postId);

    if (!existPost) {
      throw new Error("PostNotFound");
    }

    if (existPost.userId !== userId) {
      throw new Error("Forbidden");
    }

    await postRepository.deletePost(postId);
    return { message: "삭제 완료"};
  }

}

module.exports = new PostService();