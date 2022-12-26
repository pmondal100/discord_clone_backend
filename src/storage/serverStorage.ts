import { ObjectId } from "mongoose";
import { Socket } from "socket.io";
import { apiUserDataStructure } from "../utils/commonInterfaces";

export let onlineUsersData: Map<string, { userId: string }> = new Map();
export let currentUser: string = '';

export const setUserData = (socket: Socket | any, actionType: string): void => {
  const apiUserData = socket.user;
  switch (actionType) {
    case "addUser": {
      addConnectedUser(apiUserData, socket, onlineUsersData);
      break;
    }
    case "removeUser": {
      removeDisconnectedUser(socket.id, onlineUsersData);
      break;
    }
    default: {
      return;
    }
  }
};

const addConnectedUser = (
  apiUserData: apiUserDataStructure,
  socket: Socket,
  usersData: Map<string, { userId: string }>
): void => {
  const userId = apiUserData.userId;
  const socketId = socket.id;
  currentUser = userId;
  usersData.set(socketId, { userId: userId });
};

const removeDisconnectedUser = (
  socketId: string,
  usersData: Map<string, { userId: string }>
): void => {
  usersData.delete(socketId);
};

export const onlineUserSockets = (
  user_doc_id: ObjectId | String
) => {
  const userSocketList = new Array();
  onlineUsersData.forEach((value, key) => {
    if (value.userId === user_doc_id.toString()) {
      userSocketList.push(key);
    }
  });
  return userSocketList;
};
