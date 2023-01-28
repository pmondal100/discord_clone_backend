import { Application } from "express";
import { Socket } from "socket.io";
import { jwtCheck } from "./socketHandlers/socketJWTCheck";
import { setUserData, getUserFromSocketId } from "./storage/serverStorage";
import { apiUserDataStructure } from "./utils/commonInterfaces";
import directMessageHandler from "./socketHandlers/directMessageHandler";

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

  io.on("connection", async (socket: modifiedSocket) => {
    console.log('connect', socket.id);
    setUserData(socket, 'addUser');
    socket.on('disconnect', () => {
      console.log('disconnect', socket.id)
      setUserData(socket, 'removeUser');
    })
    socket.on('disconnected', () => {
      console.log('disconnected', socket.id)
      setUserData(socket, 'removeUser');
    })
    socket.on('direct-message', async (data) => {
      const userObj = await getUserFromSocketId(data.socketId);
      directMessageHandler(data, userObj._id.toString());
    })
  });
};
