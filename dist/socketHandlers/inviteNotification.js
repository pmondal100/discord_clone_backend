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
exports.rejectInvite = exports.acceptInvite = exports.userInvite = void 0;
const invitationModel_1 = __importDefault(require("../models/invitationModel"));
const serverStorage_1 = require("../storage/serverStorage");
const socketServer_1 = require("../socketServer");
const userInvite = (user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingInvitations = yield invitationModel_1.default.find({
            receiverId: user_doc_id,
        }).populate("senderId", "_id username email");
        const userSocketList = (0, serverStorage_1.onlineUserSockets)(user_doc_id);
        userSocketList.forEach((currSocketId) => {
            socketServer_1.ioInstance
                .to(currSocketId.toString())
                .emit("friendInvitation", { pendingInvitations });
        });
    }
    catch (e) {
        throw new Error(`Error occured while fetching invite list for ${user_doc_id}\n:, ${e}`);
    }
});
exports.userInvite = userInvite;
const acceptInvite = (sender_user_doc_id, receiver_user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    const invite = yield invitationModel_1.default.find({
        receiverId: receiver_user_doc_id,
        senderId: sender_user_doc_id
    }).populate("senderId", "_id username email");
    // update senders friend list
    // update recievers friend list
    removeInvite(sender_user_doc_id, receiver_user_doc_id);
});
exports.acceptInvite = acceptInvite;
const rejectInvite = (sender_user_doc_id, receiver_user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    removeInvite(sender_user_doc_id, receiver_user_doc_id);
});
exports.rejectInvite = rejectInvite;
const removeInvite = (sender_user_doc_id, receiver_user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield invitationModel_1.default.deleteOne({
        senderId: sender_user_doc_id,
        receiverId: receiver_user_doc_id
    });
});
