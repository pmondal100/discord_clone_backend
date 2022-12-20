import { Socket } from "socket.io";
import { addConnectedUser, removeDisconnectedUser } from "./serverStorageHandlers";

export let usersData: Map<string, { userId: string }> = new Map();

export const setUserData = (socket: Socket | any, actionType: string): void => {
  const apiUserData = socket.user;
  switch (actionType) {
    case "addUser": {
      addConnectedUser(apiUserData, socket, usersData);
      break;
    }
    case "removeUser": {
      removeDisconnectedUser(socket.id, usersData);
      break;
    }
    default: {
      return;
    }
  }
};
