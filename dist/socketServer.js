"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketServer = exports.ioInstance = void 0;
const socketJWTCheck_1 = require("./socketHandlers/socketJWTCheck");
const serverStorage_1 = require("./storage/serverStorage");
const inviteNotification_1 = require("./socketHandlers/inviteNotification");
const registerSocketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    exports.ioInstance = io;
    io.use(socketJWTCheck_1.jwtCheck);
    io.on("connection", (socket) => {
        (0, serverStorage_1.setUserData)(socket, 'addUser');
        (0, inviteNotification_1.userInvite)(socket.user.userId);
        socket.on('disconnect', () => {
            (0, serverStorage_1.setUserData)(socket, 'removeUser');
        });
    });
};
exports.registerSocketServer = registerSocketServer;
