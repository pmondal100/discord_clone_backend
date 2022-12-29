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
exports.rejectInvite = exports.acceptInvite = exports.friendsListOnUpdate = exports.userInvite = void 0;
const invitationModel_1 = __importDefault(require("../models/invitationModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const serverStorage_1 = require("../storage/serverStorage");
const socketServer_1 = require("../socketServer");
const lodash_1 = __importDefault(require("lodash"));
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
// export const friendsListOnStartup = async (user_doc_id: ObjectId | String): Promise<void> => {
//   const friendsListWithStatus = await getUpdatedFriendsList(user_doc_id);
//   const userSocketList = onlineUserSockets(user_doc_id);
//   userSocketList.forEach((currSocketId) => {
//     ioInstance
//       .to(currSocketId.toString())
//       .emit("friendsListOnStartup", { friendsList: friendsListWithStatus });
//   });
// };
const friendsListOnUpdate = (user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(Array.from(serverStorage_1.onlineUsersData).map((currEle) => __awaiter(void 0, void 0, void 0, function* () {
        const key = currEle[1].userId;
        const friendsListWithStatus = yield getUpdatedFriendsList(key);
        if (key !== user_doc_id) {
            socketServer_1.ioInstance
                .to(currEle[0])
                .emit("friendsListOnUpdate", { friendsList: friendsListWithStatus });
        }
    })));
});
exports.friendsListOnUpdate = friendsListOnUpdate;
const acceptInvite = (sender_user_doc_id, receiver_user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    // update senders friend list
    let sender = yield userModel_1.default.findById(sender_user_doc_id.toString());
    sender.friends = [...sender === null || sender === void 0 ? void 0 : sender.friends, receiver_user_doc_id];
    sender === null || sender === void 0 ? void 0 : sender.save();
    // update recievers friend list
    let receiver = yield userModel_1.default.findById(receiver_user_doc_id.toString());
    receiver.friends = [...receiver === null || receiver === void 0 ? void 0 : receiver.friends, sender_user_doc_id];
    receiver === null || receiver === void 0 ? void 0 : receiver.save();
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
        receiverId: receiver_user_doc_id,
    });
});
const getUpdatedFriendsList = (user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const friendsData = yield userModel_1.default.findById(user_doc_id, { friends: 1 });
        let friendsList = (friendsData === null || friendsData === void 0 ? void 0 : friendsData.friends) || [];
        friendsList = friendsList.map((currEle) => {
            return currEle.toString();
        });
        let friendsListWithStatus = [];
        let simplifiedOnlineUsersMap = [];
        serverStorage_1.onlineUsersData.forEach((value, key) => {
            simplifiedOnlineUsersMap.push(value.userId);
        });
        simplifiedOnlineUsersMap = lodash_1.default.uniq(simplifiedOnlineUsersMap);
        yield Promise.all(friendsList.map((currEle) => __awaiter(void 0, void 0, void 0, function* () {
            const userData = yield userModel_1.default.findById(currEle);
            friendsListWithStatus.push({
                id: currEle,
                username: (userData === null || userData === void 0 ? void 0 : userData.username) || "",
                isOnline: simplifiedOnlineUsersMap.indexOf(currEle) !== -1 ? true : false,
            });
        })));
        return [...friendsListWithStatus];
    }
    catch (e) {
        console.log(e);
    }
});
