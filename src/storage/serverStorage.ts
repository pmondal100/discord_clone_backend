import { Socket } from "socket.io";
import { addConnectedUser, removeDisconnectedUser } from "./serverStorageHandlers";

export let onlineUsersData: Map<string, { userId: string }> = new Map();

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
