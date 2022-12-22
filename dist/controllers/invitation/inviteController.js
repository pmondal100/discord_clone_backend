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
exports.inviteController = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const invitationModel_1 = __importDefault(require("../../models/invitationModel"));
const inviteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const senderEmail = req.user.email;
        const recieverEmail = req.body.targetInviteEmail;
        const target = yield userModel_1.default.findOne({ email: recieverEmail });
        const targetId = target === null || target === void 0 ? void 0 : target._id;
        if (!target) {
            res.status(404).send(`User ${recieverEmail} is not registered, kindly check the user email and try again.`);
            return;
        }
        if (senderEmail === recieverEmail) {
            res.status(409).send("Sorry, can't send friend request to yourself");
            return;
        }
        const invitationAlreadySent = yield invitationModel_1.default.findOne({ senderId: userId, recieverId: targetId });
        if (invitationAlreadySent) {
            res.status(400).send("Invitation already sent.");
            return;
        }
        const alreadyInFriendsList = target === null || target === void 0 ? void 0 : target.friends.find((currFriendId) => {
            if (currFriendId.toString() === userId) {
                return true;
            }
            return false;
        });
        if (alreadyInFriendsList) {
            res.status(400).send(`You are already friends with the user ${recieverEmail}.`);
            return;
        }
        yield invitationModel_1.default.create({
            senderId: userId,
            recieverId: targetId
        });
        res.status(201).send('Invitation sent successfully');
    }
    catch (e) {
        res.status(500).send(e);
    }
});
exports.inviteController = inviteController;
