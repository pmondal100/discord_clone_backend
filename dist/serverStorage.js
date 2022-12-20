"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserData = exports.usersData = void 0;
exports.usersData = new Map();
const setUserData = (socket, actionType) => {
    const apiUserData = socket.user;
    switch (actionType) {
        case "addUser": {
            addConnectedUser(apiUserData, socket);
            break;
        }
        case "removeUser": {
            removeDisconnectedUser(socket.id);
            break;
        }
        default: {
            return;
        }
    }
};
exports.setUserData = setUserData;
const addConnectedUser = (apiUserData, socket) => {
    const userId = apiUserData.userId;
    const socketId = socket.id;
    exports.usersData.forEach((value, key) => {
        var _a;
        if (((_a = exports.usersData.get(key)) === null || _a === void 0 ? void 0 : _a.userId) === userId) {
            exports.usersData.delete(key);
        }
    });
    exports.usersData.set(socketId, { userId: userId });
};
const removeDisconnectedUser = (socketId) => {
    exports.usersData.delete(socketId);
};
