"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDisconnectedUser = exports.addConnectedUser = void 0;
const addConnectedUser = (apiUserData, socket, usersData) => {
    const userId = apiUserData.userId;
    const socketId = socket.id;
    usersData.forEach((value, key) => {
        var _a;
        if (((_a = usersData.get(key)) === null || _a === void 0 ? void 0 : _a.userId) === userId) {
            usersData.delete(key);
        }
    });
    usersData.set(socketId, { userId: userId });
};
exports.addConnectedUser = addConnectedUser;
const removeDisconnectedUser = (socketId, usersData) => {
    usersData.delete(socketId);
};
exports.removeDisconnectedUser = removeDisconnectedUser;
