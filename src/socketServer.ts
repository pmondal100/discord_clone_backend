import { Application } from "express";
import { Socket } from "socket.io";
import { jwtCheck } from "./socketHandlers/socketJWTCheck";
import { setUserData } from "./storage/serverStorage";

export const registerSocketServer = (server: Application) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(jwtCheck);

  io.on("connection", (socket: Socket) => {
    console.log("user connected.");
    console.log(socket.id);
    setUserData(socket, 'addUser');
    socket.on('disconnect', () => {
      setUserData(socket, 'removeUser');
    })
  });
};
