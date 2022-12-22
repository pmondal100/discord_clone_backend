"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserData = exports.onlineUsersData = void 0;
const serverStorageHandlers_1 = require("./serverStorageHandlers");
exports.onlineUsersData = new Map();
const setUserData = (socket, actionType) => {
    const apiUserData = socket.user;
    switch (actionType) {
        case "addUser": {
            (0, serverStorageHandlers_1.addConnectedUser)(apiUserData, socket, exports.onlineUsersData);
            break;
        }
        case "removeUser": {
            (0, serverStorageHandlers_1.removeDisconnectedUser)(socket.id, exports.onlineUsersData);
            break;
        }
        default: {
            return;
        }
    }
};
exports.setUserData = setUserData;
