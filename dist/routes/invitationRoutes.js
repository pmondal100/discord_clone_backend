"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const friendsInvitationController_1 = __importDefault(require("../controllers/invitation/friendsInvitationController"));
const joi_1 = __importDefault(require("joi"));
const express_joi_validation_1 = __importDefault(require("express-joi-validation"));
const auth_1 = __importDefault(require("../customMiddlewares/auth"));
const validator = express_joi_validation_1.default.createValidator({});
const inviteValidationSchema = joi_1.default.object({
    targetInviteEmail: joi_1.default.string().email().required(),
});
const router = express_1.default.Router();
router.use(express_1.default.json());
router.post('/invite', auth_1.default, validator.body(inviteValidationSchema), friendsInvitationController_1.default.inviteController);
module.exports = router;
