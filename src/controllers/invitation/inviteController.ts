import { Request, Response } from "express";
import User from "../../models/userModel";
import invitation from "../../models/invitationModel";
import { userInvite } from "../../socketHandlers/inviteNotification";

export const inviteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.userId;
    const senderEmail = req.user.email;
    const receiverEmail = req.body.targetInviteEmail;
    const target = await User.findOne({ email: receiverEmail });
    const targetId = target?._id;

    if (!target) {
      res
        .status(404)
        .send(
          `User ${receiverEmail} is not registered, kindly check the user email and try again.`
        );
      return;
    }
    if (senderEmail === receiverEmail) {
      res.status(409).send("Sorry, can't send friend request to yourself");
      return;
    }
    const invitationAlreadySent: any = await invitation.findOne({
      senderId: userId,
      receiverId: targetId,
    });
    if (invitationAlreadySent) {
      res.status(400).send("Invitation already sent.");
      return;
    }
    const alreadyInFriendsList = target?.friends.find((currFriendId) => {
      if (currFriendId.toString() === userId) {
        return true;
      }
      return false;
    });
    if (alreadyInFriendsList) {
      res
        .status(400)
        .send(`You are already friends with the user ${receiverEmail}.`);
      return;
    }
    try {
      await invitation.create({
        senderId: userId,
        receiverId: targetId,
      });
    } catch (e) {
      throw new Error(`DB save error:\n, ${e}`);
    }

    //@ts-ignore
    await userInvite(targetId);

    res.status(201).send("Invitation sent successfully");
  } catch (e) {
    res.status(500).send(e);
  }
};
