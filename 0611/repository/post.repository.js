const { prisma } = require("../utils/prisma/index");

class PostRepository {

  // 모든 게시글 조회
  async findAllPosts() {
    return await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // 특정 게시글 조회
  async findByPostId(postId) {
    return await prisma.post.findUnique({
      where: { postId }
    });
  }

  // 특정 사용자의 게시글 조회
  async findByUserId(userId) {
    return await prisma.post.findMany({
      where: { userId }
    });
  }

  // 게시글 생성
  async createPost(title, content, userId) {
    return await prisma.post.create({
      data: {
        title, 
        content,
        userId
      }
    });
  }

  // 게시글 업데이트
  async updatePost(title, content, postId, userId) {
  return await prisma.post.update({
    where: { 
      postId: postId,
      userId: userId
    },
    data: { title, content }
  });
}

  // 게시글 삭제
  async deletePost(postId) {
    return await prisma.post.delete({
      where: { postId }
    });
  }
}

module.exports = new PostRepository();