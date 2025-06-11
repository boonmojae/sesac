import express from "express";
import { prisma } from "../utils/prisma/index.js"

const router = express.Router();

//전체 게시글 조회
router.get("/", async (req, res) => {

    try {
        const post = await prisma.post.findMany();
        res.send(post);
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            error: e.message
        })
    }
});

//특정 게시글 조회
router.get("/:id", async (req, res) => {

    const id = Number(req.params.id);

    try {
        const post = await prisma.post.findUnique({
            where: { postId: id }
        });

        if (!post) {
            return res.status(404).send({ error: "게시글을 찾을 수 없습니다." });
        }

        res.send(post);

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            error: e.message
        })
    }
});


//게시글 생성
router.post("/", async (req, res) => {

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
        console.log(e);
        return res.status(500).send({
            message: "게시글 생성 에러",
            error: e.message
        });
    }
});

//게시글 수정
router.put("/:id", async (req, res) => {

    const id = Number(req.params.id);
    const { title, content, userId } = req.body;
    
    try {

        const post = await prisma.post.findUnique({
            where: { postId: id}
        });

        if (!post) {
            return res.send({
                message: "게시글이 존재하지 않습니다"
            });
        }

        await prisma.post.update({
            where: { postId: id},
            data: {
                title,
                content,
            }
        });

        res.send({
            message: "게시글 수정 완료"
        });
        

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            error: e.message
        })
    }

});

//게시글 삭제
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const post = await prisma.post.findUnique({
            where: { postId: id }
        });

        if (!post) {
            return res.status(404).send({
                message: "존재하지 않는 게시글입니다."
            });
        }

        await prisma.post.delete({
            where: { postId: id }
        });

        res.send({
            message: "게시글 삭제 완료"
        });

    } catch (e) {
        console.error(e);
        return res.status(500).send({
            message: "게시글 삭제 중 에러가 발생했습니다.",
            error: e.message
        });
    }
});



export default router;