import express from "express";
import userRouter from "./routers/user.router.js";
import postRouter from "./routers/post.router.js";

const PORT = 4000;
const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(PORT, () => {
    console.log(`Example app listening port ${PORT}`)
});