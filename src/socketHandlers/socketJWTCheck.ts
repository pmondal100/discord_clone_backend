import { Socket } from "socket.io";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const jwtCheck = (socket: Socket, next: NextFunction) => {
    const token = socket.handshake.auth?.jwtToken;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || "");
      //@ts-ignore
      socket["user"] = decoded;
    } catch (e) {
      const socketError = new Error("Token not valid.");
      return next(socketError);
    }
    next();
}