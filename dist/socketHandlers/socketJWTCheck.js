"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtCheck = (socket, next) => {
    var _a;
    const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.jwtToken;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        //@ts-ignore
        socket["user"] = decoded;
    }
    catch (e) {
        const socketError = new Error("Token not valid.");
        return next(socketError);
    }
    next();
};
exports.jwtCheck = jwtCheck;
