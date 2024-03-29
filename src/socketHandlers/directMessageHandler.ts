import { onlineUserSockets } from "../storage/serverStorage";
import { ioInstance } from "../socketServer";
import Conversation from "../models/conversationModel";
import Message from "../models/messageModel";

const directMessageHandler = async (data: {
  targetId: string;
  message?: string;
}, currentUser: string) => {
  if (data?.message === undefined) {
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUser, data.targetId] },
    });
    await updateDirectChatHistory(conversation?._id.toString(), true, currentUser);
    return;
  }
  const target = data?.targetId;
  const message = data?.message;

  // store message to the db
  const messageObj = await Message.create({
    author: currentUser,
    date: new Date(),
    type: "Direct",
    content: message,
  });

  // store message in the conversation

  let conversation = await Conversation.findOne({
    participants: { $all: [currentUser, target] },
  });

  if (conversation) {
    conversation.messages.push(messageObj._id);
    await conversation.save();
  } else {
    conversation = await Conversation.create({
      participants: [currentUser, target],
      messages: [messageObj._id],
    });
  }
  await updateDirectChatHistory(conversation?._id.toString(), false, currentUser);
};

const updateDirectChatHistory = async (
  conversationId: String | undefined,
  updateSingleUser: Boolean,
  currentUser: string
) => {
  const conversationObj = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "author",
      model: "User",
      select: "username _id",
    },
  });
  if (!updateSingleUser) {
    conversationObj?.participants.forEach((currParticipant) => {
      const userSocketList = onlineUserSockets(currParticipant.toString());
      if (userSocketList.length > 0) {
        userSocketList.forEach((currSocket) => {
          ioInstance.to(currSocket).emit("direct-message-history", {
            conversationObj,
          });
        });
      }
    });
  } else {
    const userSocketList = onlineUserSockets(currentUser.toString());
    if (userSocketList.length > 0) {
      userSocketList.forEach((currSocket) => {
        ioInstance.to(currSocket).emit("direct-message-history", {
          conversationObj,
        });
      });
    }
  }
};

export default directMessageHandler;
