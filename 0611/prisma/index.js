import { PrismaClient } from "@prisma/client";

//데이터베이스와 연결할 prismaClient 인스턴스(객체) 생성
export const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
});