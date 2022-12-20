import { Application } from "express";
import { Socket } from "socket.io";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { setUserData } from "./storage/serverStorage";

export const registerSocketServer = (server: Application) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket: any, next: NextFunction) => {
    const token = socket.handshake.auth?.jwtToken;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || "");
      socket["user"] = decoded;
    } catch (e) {
      const socketError = new Error("Token not valid.");
      return next(socketError);
    }
    next();
  });

  io.on("connection", (socket: Socket) => {
    console.log("user connected.");
    console.log(socket.id);
    setUserData(socket, 'addUser');
    socket.on('disconnect', () => {
      setUserData(socket, 'removeUser');
    })
  });
};
