"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        res
            .status(403)
            .json({ message: "A token is required for authentication." });
        return;
    }
    try {
        token = token.replace(/^Bearer\s+/, "");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        //@ts-ignore
        req["user"] = decoded;
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
    return next();
};
exports.default = verifyJWT;
