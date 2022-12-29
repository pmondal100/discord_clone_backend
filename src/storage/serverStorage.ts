import { ObjectId } from "mongoose";
import { Socket } from "socket.io";
import { apiUserDataStructure } from "../utils/commonInterfaces";
import { userInvite, friendsListOnUpdate } from "../socketHandlers/inviteNotification";
import _ from 'lodash';

export let onlineUsersData: Map<string, { userId: string, timestamp: number }> = new Map();
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

const addConnectedUser = async (
  apiUserData: apiUserDataStructure,
  socket: any,
  usersData: Map<string, { userId: string, timestamp: number }>
): Promise<void> => {
  const userId = apiUserData.userId;
  const socketId = socket.id;
  currentUser = userId;
  usersData.set(socketId, { userId: userId, timestamp: Date.now() });
  await userInvite(socket.user.userId);
  await friendsListOnUpdate('');
}

const removeDisconnectedUser = async (
  socketId: string,
  usersData: Map<string, { userId: string, timestamp: number }>
): Promise<void> => {
  const mapArr = Array.from(usersData);
  mapArr.every((currEle, index) => {
    if(currEle[0] === socketId){
      if(mapArr.length > 1 && index !== 0 && mapArr[index - 1][1].userId === currEle[1].userId){
        usersData.delete(mapArr[index-1][0]);
      }
      usersData.delete(socketId);
    }
    return true;
  })
  await friendsListOnUpdate(socketId);
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
