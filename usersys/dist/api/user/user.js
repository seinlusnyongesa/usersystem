"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt = __importStar(require("bcrypt"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    if (users.length == 0) {
        res.status(200).json({ message: "no user found" });
        return;
    }
    res.status(200).json(users);
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({
        where: { id: parseInt(req.userId) }
    });
    if (!user) {
        res.json({ message: "no such user" });
        return;
    }
    res.json(user);
}));
router.post("/register", registerUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.userId = req.user.id;
    res.json(req.user);
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        user = yield prisma.user.findUnique({
            where: { username: req.body.username }
        });
    }
    catch (err) {
        throw err;
    }
    if (user == null) {
        res.json({ field: "user", message: "no user" });
        return;
    }
    const rpass = yield bcrypt.compare(req.body.password, user.password);
    if (!rpass) {
        res.json({ field: "password", message: "password not correct" });
        return;
    }
    req.session.userId = user.id;
    res.json(user);
}));
router.param("userId", (req, res, next) => {
    req.userId = req.params.userId;
    next();
});
function registerUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        if (req.body.password.length < 8) {
            res.json({
                field: "password",
                message: "password can't be less than 8 characters"
            });
            return;
        }
        try {
            user = yield prisma.user.create({
                data: {
                    username: req.body.username,
                    password: yield bcrypt.hash(req.body.password, 10)
                }
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    res.json({ field: "username", message: "username already taken" });
                    return;
                }
            }
            throw e;
        }
        req.user = user;
    });
}
module.exports = router;
//# sourceMappingURL=user.js.map