"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketServer = void 0;
const socketJWTCheck_1 = require("./socketHandlers/socketJWTCheck");
const serverStorage_1 = require("./storage/serverStorage");
const registerSocketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use(socketJWTCheck_1.jwtCheck);
    io.on("connection", (socket) => {
        console.log("user connected.");
        console.log(socket.id);
        (0, serverStorage_1.setUserData)(socket, 'addUser');
        socket.on('disconnect', () => {
            (0, serverStorage_1.setUserData)(socket, 'removeUser');
        });
    });
};
exports.registerSocketServer = registerSocketServer;
