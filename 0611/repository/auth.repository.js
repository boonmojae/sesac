const { prisma } = require("../utils/prisma/index.js");

class AuthRepository {

  async findByEmail(email) {
    return await prisma.users.findFirst({
      where: { email }
    });
  }

  async createUser(email, password, nickname) {
    return await prisma.users.create({
      data: {
        email,
        password: password,
        nickname
      }
    })
  }
}

module.exports = new AuthRepository();

//데이터를 찾아서 service에게 전달