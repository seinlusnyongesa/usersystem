import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();
//fetching all the users from the database
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  if (users.length == 0) {
    res.status(200).json({ message: "no user found" });
    return;
  }
  res.status(200).json(users);
});

//getting a user with specific id
router.get("/:userId", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: parseInt(req.userId) }
  });
  if (!user) {
    res.json({ message: "no such user" });
    return;
  }
  res.json(user);
});

//register
//saving a user to the database
//setting a session
router.post("/register", registerUser, async (req, res) => {
  req.session.userId = req.user.id;
  res.json(req.user);
});

//login in a user to the system
//setting a session
router.post("/login", async (req, res) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { username: req.body.username }
    });
  } catch (err) {
    throw err;
  }
  if (user == null) {
    res.json({ field: "user", message: "no user" });
    return;
  }
  const rpass = await bcrypt.compare(req.body.password, user.password);
  if (!rpass) {
    res.json({ field: "password", message: "password not correct" });
    return;
  }

  req.session.userId = user.id;
  res.json(user);
});

router.param("userId", (req, res, next) => {
  req.userId = req.params.userId;
  next();
});

//register user middleware
async function registerUser(req, res, next) {
  let user;
  if (req.body.password.length < 8) {
    res.json({
      field: "password",
      message: "password can't be less than 8 characters"
    });

    return;
  }

  try {
    user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        res.json({ field: "username", message: "username already taken" });
        return;
      }
    }
    throw e;
  }

  req.user = user;
}
module.exports = router;
