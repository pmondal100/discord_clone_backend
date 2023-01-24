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
const serverStorage_1 = require("../storage/serverStorage");
const socketServer_1 = require("../socketServer");
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const directMessageHandler = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data === undefined) {
        updateDirectChatHistory(undefined, true);
        return;
    }
    const target = data === null || data === void 0 ? void 0 : data.targetId;
    const message = data === null || data === void 0 ? void 0 : data.message;
    // store message to the db
    const messageObj = yield messageModel_1.default.create({
        author: serverStorage_1.currentUser,
        date: new Date(),
        type: 'Direct',
        content: message
    });
    // store message in the conversation
    const conversation = yield conversationModel_1.default.findOne({
        participants: { $all: [serverStorage_1.currentUser, target] },
    });
    if (conversation) {
        conversation.messages.push(messageObj._id);
        yield conversation.save();
    }
    else {
        yield conversationModel_1.default.create({
            participants: [
                serverStorage_1.currentUser,
                target
            ],
            messages: [
                messageObj._id
            ]
        });
    }
    updateDirectChatHistory(conversation === null || conversation === void 0 ? void 0 : conversation._id.toString(), false);
});
const updateDirectChatHistory = (conversationId, updateSingleUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!updateSingleUser) {
        const conversationObj = yield conversationModel_1.default.findById(conversationId).populate({
            path: 'messages',
            model: 'Message',
            populate: {
                path: 'author',
                model: 'User',
                select: 'username _id'
            }
        });
        conversationObj === null || conversationObj === void 0 ? void 0 : conversationObj.participants.forEach((currParticipant) => {
            const userSocketList = (0, serverStorage_1.onlineUserSockets)(currParticipant.toString());
            if (userSocketList.length > 0) {
                userSocketList.forEach((currSocket) => {
                    socketServer_1.ioInstance.to(currSocket).emit('direct-message-history');
                });
            }
        });
    }
    else {
        const userSocketList = (0, serverStorage_1.onlineUserSockets)(serverStorage_1.currentUser.toString());
        if (userSocketList.length > 0) {
            userSocketList.forEach((currSocket) => {
                socketServer_1.ioInstance.to(currSocket).emit('direct-message-history');
            });
        }
    }
});
exports.default = directMessageHandler;
