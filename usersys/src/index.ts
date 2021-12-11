import express from "express";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import userRouter from "./api/user/user";
import postRouter from "./api/post/post";
import { Prisma, PrismaClient } from ".prisma/client";
import cors from "cors"

const main = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  let RedisStore = connectRedis(session);
  let redisClient = new Redis();

  app.use(cors())
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: "keyboard cat",

      name: "bop",
      resave: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 3,
        sameSite: "lax",
        httpOnly: true
      }
    })
  );

  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  const PORT = 4000;
  const prisma = new PrismaClient();

  app.get("/", async (req, res) => {
    res.send("hello");
  });

  app.listen(PORT, () => console.log(`app running on port ${PORT}`));
};

main().catch(e => {
  throw e;
});
