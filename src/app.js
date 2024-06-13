import express from "express";
import "./utils/prisma.util.js";
import { HTTP_STATUS } from "./constants/http-status.constant.js";
import { SERVER_PORT } from "./constants/env.constant.js";
import { apiRouter } from "./routers/index.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/server-check", (req, res, next) => {
  return res.status(HTTP_STATUS.OK).send("server works!!");
});

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  console.log(SERVER_PORT, "포트로 서버가 열렸어요!");
});
