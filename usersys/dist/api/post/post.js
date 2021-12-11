"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prisma.post.findMany({ include: { author: true } });
    res.json(posts);
}));
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post;
    if (req.session.userId === null) {
        res.json({ message: "log in" });
        return;
    }
    try {
        post = yield prisma.post.create({
            data: { text: req.body.text, authorId: req.session.userId }
        });
    }
    catch (error) {
        throw error;
    }
    res.json(post);
}));
module.exports = router;
//# sourceMappingURL=post.js.map