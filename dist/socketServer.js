"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketServer = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerSocketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => {
        var _a;
        const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.jwtToken;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
            socket["user"] = decoded;
        }
        catch (e) {
            const socketError = new Error("Token not valid.");
            return next(socketError);
        }
        next();
    });
    io.on("connection", (socketDetails) => {
        console.log("user connected.");
        console.log(socketDetails.id);
    });
};
exports.registerSocketServer = registerSocketServer;
