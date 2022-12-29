import Invitation from "../models/invitationModel";
import User from "../models/userModel";
import { ObjectId } from "mongoose";
import { onlineUserSockets, onlineUsersData } from "../storage/serverStorage";
import { ioInstance } from "../socketServer";
import _ from "lodash";

export const userInvite = async (
  user_doc_id: ObjectId | String
): Promise<void> => {
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

// export const friendsListOnStartup = async (user_doc_id: ObjectId | String): Promise<void> => {
//   const friendsListWithStatus = await getUpdatedFriendsList(user_doc_id);
//   const userSocketList = onlineUserSockets(user_doc_id);
//   userSocketList.forEach((currSocketId) => {
//     ioInstance
//       .to(currSocketId.toString())
//       .emit("friendsListOnStartup", { friendsList: friendsListWithStatus });
//   });
// };

export const friendsListOnUpdate = async (user_doc_id: ObjectId | String): Promise<void> => {
  await Promise.all(
    Array.from(onlineUsersData).map(async (currEle) => {
      const key = currEle[1].userId;
      const friendsListWithStatus = await getUpdatedFriendsList(key);
      if(key !== user_doc_id){
        ioInstance
        .to(currEle[0])
        .emit("friendsListOnUpdate", { friendsList: friendsListWithStatus });
      }
    })
  )
};

export const acceptInvite = async (
  sender_user_doc_id: ObjectId | String,
  receiver_user_doc_id: ObjectId | String
): Promise<void> => {
  // update senders friend list
  let sender: any = await User.findById(sender_user_doc_id.toString());
  sender.friends = [...sender?.friends, receiver_user_doc_id];
  sender?.save();
  // update recievers friend list
  let receiver: any = await User.findById(receiver_user_doc_id.toString());
  receiver.friends = [...receiver?.friends, sender_user_doc_id];
  receiver?.save();

  removeInvite(sender_user_doc_id, receiver_user_doc_id);
};

export const rejectInvite = async (
  sender_user_doc_id: ObjectId | String,
  receiver_user_doc_id: ObjectId | String
): Promise<void> => {
  removeInvite(sender_user_doc_id, receiver_user_doc_id);
};

const removeInvite = async (
  sender_user_doc_id: ObjectId | String,
  receiver_user_doc_id: ObjectId | String
): Promise<void> => {
  await Invitation.deleteOne({
    senderId: sender_user_doc_id,
    receiverId: receiver_user_doc_id,
  });
};

const getUpdatedFriendsList = async (
  user_doc_id: ObjectId | String
): Promise<{ id: string; isOnline: boolean; username: string }[] | void> => {
  try {
    const friendsData: { friends: Array<string> } | null = await User.findById(
      user_doc_id,
      { friends: 1 }
    );
    let friendsList = friendsData?.friends || [];
    friendsList = friendsList.map((currEle) => {
      return currEle.toString();
    });
    let friendsListWithStatus: {
      id: string;
      isOnline: boolean;
      username: string;
    }[] = [];
    let simplifiedOnlineUsersMap: Array<string> = [];
    onlineUsersData.forEach((value, key) => {
      simplifiedOnlineUsersMap.push(value.userId);
    });
    simplifiedOnlineUsersMap = _.uniq(simplifiedOnlineUsersMap);
    await Promise.all(
      friendsList.map(async (currEle: string) => {
        const userData = await User.findById(currEle);
        friendsListWithStatus.push({
          id: currEle,
          username: userData?.username || "",
          isOnline:
            simplifiedOnlineUsersMap.indexOf(currEle) !== -1 ? true : false,
        });
      })
    );
    return [ ...friendsListWithStatus ];
  } catch (e) {
    console.log(e);
  }
};
