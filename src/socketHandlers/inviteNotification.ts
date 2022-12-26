import Invitation from "../models/invitationModel";
import User from '../models/userModel';
import { ObjectId } from "mongoose";
import { onlineUserSockets } from "../storage/serverStorage";
import { ioInstance } from "../socketServer";

export const userInvite = async (user_doc_id: ObjectId | String): Promise<void> => {
  try {
    const pendingInvitations = await Invitation.find({
      receiverId: user_doc_id,
    }).populate("senderId", "_id username email");

    const userSocketList = onlineUserSockets(user_doc_id);

    userSocketList.forEach((currSocketId) => {
      ioInstance
        .to(currSocketId.toString())
        .emit("friendInvitation", { pendingInvitations });
    });
  } catch (e) {
    throw new Error(
      `Error occured while fetching invite list for ${user_doc_id}\n:, ${e}`
    );
  }
};

export const acceptInvite = async (sender_user_doc_id: ObjectId | String, receiver_user_doc_id: ObjectId | String): Promise<void> => {
  const invite = await Invitation.find({
    receiverId: receiver_user_doc_id,
    senderId: sender_user_doc_id
  }).populate("senderId", "_id username email");

  // update senders friend list

  // update recievers friend list

  removeInvite( sender_user_doc_id, receiver_user_doc_id );
}

export const rejectInvite = async (sender_user_doc_id: ObjectId | String, receiver_user_doc_id: ObjectId | String): Promise<void> => {
  removeInvite( sender_user_doc_id, receiver_user_doc_id );
}

const removeInvite = async (sender_user_doc_id: ObjectId | String, receiver_user_doc_id: ObjectId | String): Promise<void> => {
  await Invitation.deleteOne({
    senderId: sender_user_doc_id,
    receiverId: receiver_user_doc_id
  })
}
