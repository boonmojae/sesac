const express = require("express");
const userRouter = require("./routers/users.router");
const cookieParser = require("cookie-parser");
const errorHandingMiddleware = require('./middleware/error-handing-middleware.js')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// app.user(cookieParser());

app.use("/", [userRouter])

// app.use((err, req, res, next)=>{

//   if (err.message === "password") {
//     console.error(err.message);
//   }
//   res.status(500).send('something broke')
// });

app.use(errorHandingMiddleware);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

