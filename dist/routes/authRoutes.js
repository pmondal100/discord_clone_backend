"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = __importDefault(require("../controllers/auth/authControllers"));
const joi_1 = __importDefault(require("joi"));
const express_joi_validation_1 = __importDefault(require("express-joi-validation"));
const validator = express_joi_validation_1.default.createValidator({});
const registerSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(12).required(),
    password: joi_1.default.string().min(6).max(12).required(),
    email: joi_1.default.string().email().required()
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).max(12).required()
});
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/registerUser', validator.body(registerSchema), authControllers_1.default.registerController);
router.post('/loginUser', validator.body(loginSchema), authControllers_1.default.loginController);
module.exports = router;
