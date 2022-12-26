"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUserSockets = exports.setUserData = exports.currentUser = exports.onlineUsersData = void 0;
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
const addConnectedUser = (apiUserData, socket, usersData) => {
    const userId = apiUserData.userId;
    const socketId = socket.id;
    exports.currentUser = userId;
    usersData.set(socketId, { userId: userId });
};
const removeDisconnectedUser = (socketId, usersData) => {
    usersData.delete(socketId);
};
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
