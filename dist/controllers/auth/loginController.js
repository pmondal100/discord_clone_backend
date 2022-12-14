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
const userModel_1 = __importDefault(require("../../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (user && (yield bcrypt_1.default.compare(password, (user.password || '')))) {
            const token = jsonwebtoken_1.default.sign({
                userId: user._id,
                email
            }, process.env.SECRET_KEY || '', {
                expiresIn: "24h"
            });
            res.status(201).json({
                message: 'Login Successfull.',
                token,
                username: user.username,
                email: user.email
            });
            return;
        }
        res.status(401).send('Invalid credentials.');
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.default = loginController;
