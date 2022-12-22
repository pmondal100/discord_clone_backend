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
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const userExists = yield userModel_1.default.exists({ email });
        if (!userExists) {
            const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield userModel_1.default.create({
                username,
                email,
                password: encryptedPassword,
            });
            const token = jsonwebtoken_1.default.sign({
                userId: user._id,
                email,
            }, process.env.SECRET_KEY || "", {
                expiresIn: "24h",
            });
            res
                .status(201)
                .json({ message: "User creation successfull", username, email, token });
            return;
        }
        res.status(409).json({
            message: "Cannot use same email for multiple users, please try registering with a different email.",
        });
    }
    catch (err) {
        res.status(500).json({ message: `User creation failed due to: ${err}` });
    }
});
exports.default = registerController;
