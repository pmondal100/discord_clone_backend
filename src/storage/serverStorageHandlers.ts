import { Socket } from "socket.io";
interface apiUserDataStructure {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const addConnectedUser = (
  apiUserData: apiUserDataStructure,
  socket: Socket,
  usersData: Map<string, { userId: string }>
): void => {
  const userId = apiUserData.userId;
  const socketId = socket.id;
  usersData.forEach((value, key) => {
    if (usersData.get(key)?.userId === userId) {
      usersData.delete(key);
    }
  });
  usersData.set(socketId, { userId: userId });
};

export const removeDisconnectedUser = (
  socketId: string,
  usersData: Map<string, { userId: string }>
): void => {
  usersData.delete(socketId);
};