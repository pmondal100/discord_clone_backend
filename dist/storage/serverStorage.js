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
exports.getUserFromSocketId = exports.onlineUserSockets = exports.setUserData = exports.currentUser = exports.onlineUsersData = void 0;
const inviteNotification_1 = require("../socketHandlers/inviteNotification");
const userModel_1 = __importDefault(require("../models/userModel"));
exports.onlineUsersData = new Map();
exports.currentUser = '';
const setUserData = (socket, actionType) => {
    const apiUserData = socket.user;
    switch (actionType) {
        case "addUser": {
            addConnectedUser(apiUserData, socket, exports.onlineUsersData);
            break;
        }
        case "removeUser": {
            removeDisconnectedUser(socket.id, exports.onlineUsersData);
            break;
        }
        default: {
            return;
        }
    }
};
exports.setUserData = setUserData;
const addConnectedUser = (apiUserData, socket, usersData) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = apiUserData.userId;
    const socketId = socket.id;
    exports.currentUser = userId;
    usersData.set(socketId, { userId: userId, timestamp: Date.now() });
    yield (0, inviteNotification_1.userInvite)(socket.user.userId);
    yield (0, inviteNotification_1.friendsListOnUpdate)('');
});
const removeDisconnectedUser = (socketId, usersData) => __awaiter(void 0, void 0, void 0, function* () {
    const mapArr = Array.from(usersData);
    mapArr.every((currEle, index) => {
        if (currEle[0] === socketId) {
            if (mapArr.length > 1 && index !== 0 && mapArr[index - 1][1].userId === currEle[1].userId) {
                usersData.delete(mapArr[index - 1][0]);
            }
            usersData.delete(socketId);
        }
        return true;
    });
    yield (0, inviteNotification_1.friendsListOnUpdate)(socketId);
});
const onlineUserSockets = (user_doc_id) => {
    const userSocketList = new Array();
    exports.onlineUsersData.forEach((value, key) => {
        if (value.userId === user_doc_id.toString()) {
            userSocketList.push(key);
        }
    });
    return userSocketList;
};
exports.onlineUserSockets = onlineUserSockets;
const getUserFromSocketId = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    const mapArr = Array.from(exports.onlineUsersData);
    let userObj = mapArr.find((currEle) => {
        return socketId === currEle[0];
    });
    return yield userModel_1.default.findById(userObj === null || userObj === void 0 ? void 0 : userObj[1].userId);
});
exports.getUserFromSocketId = getUserFromSocketId;
