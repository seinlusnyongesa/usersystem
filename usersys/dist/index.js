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
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const user_1 = __importDefault(require("./api/user/user"));
const post_1 = __importDefault(require("./api/post/post"));
const client_1 = require(".prisma/client");
const cors_1 = __importDefault(require("cors"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    let RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    let redisClient = new ioredis_1.default();
    app.use((0, cors_1.default)());
    app.use((0, express_session_1.default)({
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
    }));
    app.use("/api/users", user_1.default);
    app.use("/api/posts", post_1.default);
    const PORT = 4000;
    const prisma = new client_1.PrismaClient();
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("hello");
    }));
    app.listen(PORT, () => console.log(`app running on port ${PORT}`));
});
main().catch(e => {
    throw e;
});
//# sourceMappingURL=index.js.map