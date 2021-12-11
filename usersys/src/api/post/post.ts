import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({ include: { author: true } });
  res.json(posts);
});

router.post("/create", async (req, res) => {
  let post;

  if (req.session.userId === null) {
    res.json({ message: "log in" });
    return;
  }
  try {
    post = await prisma.post.create({
      data: { text: req.body.text, authorId: req.session.userId }
    });
  } catch (error) {
    throw error;
  }
  res.json(post);
});

module.exports = router;
