import express from "express";
import { prisma } from "../utils/prisma/index.js"

const router = express.Router();

//전체 유저 목록 조회
router.get("/", async (req, res) => {
    const users = await prisma.users.findMany();

    try {
        if (users.length === 0) {
            return res.status(404).send({
                message: "회원이 존재하지 않습니다."
            });
        }

        res.send(users);

    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "서버 오류"
        })
    }

});


//특정 유저 정보 조회
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const user = await prisma.users.findUnique({
            where: { userId: id }
        });

        if (!user) {
            return res.status(404).send({ error: "사용자를 찾을 수 없습니다." });
        }

        res.send(user);

    } catch (e) {
        console.log(e);
    }
})


//유저 생성
router.post("/", async (req, res) => {
    const { email, password, nickname } = req.body;

    try {

        //아이디 중복 체크
        const existUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existUser) {
            return res.send({
                message: "중복된 아이디"
            });
        }

        await prisma.users.create({
            data: {
                email,
                password,
                nickname
            }
        });

        return res.send({
            message: "회원가입 완료"
        });
    } catch (e) {
        console.log(e);
    }
});


//유저 정보 수정
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { email, password, nickname } = req.body;

    try {
        const updatedUser = await prisma.users.update({
            where: { userId: id },
            data: {
                email,
                password,
                nickname
            }
        });

        return res.send({
            message: "유저 정보 수정 완료",
            user: updatedUser
        });

    } catch (e) {
        console.error(e);
        return res.status(500).send({
            message: "유저 정보 수정 중 오류가 발생했습니다.",
            error: e.message
        });
    }
});


//유저 삭제
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const user = await prisma.users.findUnique({
            where: { userId: id }
        });

        if (!user) {
            return res.status(404).send({
                message: "존재하지 않는 유저입니다"
            });
        }

        await prisma.users.delete({
            where: { userId: id }
        });

        res.send({
            message: "유저 삭제"
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: "유저 삭제 에러",
            error: e.message
        })
    }
});


//특정 유저의 게시글 조회
router.get("/:id/posts", async(req, res) => {

    const id = Number(req.params.id);

    try {
        const posts = await prisma.post.findMany({
            where: { userId: id }
        });

        if (!posts || posts.length === 0) {
            return res.send({
                message: "작성한 게시글이 존재하지 않습니다다"
            });
        }

        res.send(posts);


    } catch(e) {
        console.log(e);
        return res.status(500).send({
            error: e.message
        });
    }
});



export default router;