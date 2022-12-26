import { Application } from "express";
import { Socket } from "socket.io";
import { jwtCheck } from "./socketHandlers/socketJWTCheck";
import { setUserData } from "./storage/serverStorage";
import { userInvite } from "./socketHandlers/inviteNotification";
import { apiUserDataStructure } from "./utils/commonInterfaces";
interface modifiedSocket extends Socket {
  user: apiUserDataStructure
}

export let ioInstance: any;

export const registerSocketServer = (server: Application) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance = io;

  io.use(jwtCheck);

  io.on("connection", (socket: modifiedSocket) => {
    setUserData(socket, 'addUser');
    userInvite(socket.user.userId);
    socket.on('disconnect', () => {
      setUserData(socket, 'removeUser');
    })
  });
};
