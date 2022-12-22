"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDisconnectedUser = exports.addConnectedUser = void 0;
const addConnectedUser = (apiUserData, socket, usersData) => {
    const userId = apiUserData.userId;
    const socketId = socket.id;
    // usersData.forEach((value, key) => {
    //   if (usersData.get(key)?.userId === userId) {
    //     usersData.delete(key);
    //   }
    // });
    usersData.set(socketId, { userId: userId });
};
exports.addConnectedUser = addConnectedUser;
const removeDisconnectedUser = (socketId, usersData) => {
    usersData.delete(socketId);
};
exports.removeDisconnectedUser = removeDisconnectedUser;
