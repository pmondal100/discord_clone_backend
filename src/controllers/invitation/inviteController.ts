import { Request, Response } from "express";
import User from "../../models/userModel";
import invitation from "../../models/invitationModel";

export const inviteController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const senderEmail = req.user.email;
    const recieverEmail = req.body.targetInviteEmail;
    const target = await User.findOne({ email: recieverEmail })
    const targetId = target?._id;
    
    if(!target){
      res.status(404).send(`User ${recieverEmail} is not registered, kindly check the user email and try again.`);
      return;
    }
    if(senderEmail === recieverEmail){
      res.status(409).send("Sorry, can't send friend request to yourself");
      return;
    }
    const invitationAlreadySent: any = await invitation.findOne({ senderId: userId, recieverId: targetId });
    if(invitationAlreadySent) {
      res.status(400).send("Invitation already sent.")
      return;
    }
    const alreadyInFriendsList = target?.friends.find((currFriendId) => {
      if(currFriendId.toString() === userId){
        return true;
      }
      return false;
    })
    if(alreadyInFriendsList){
      res.status(400).send(`You are already friends with the user ${recieverEmail}.`);
      return;
    }

    await invitation.create({
      senderId: userId,
      recieverId: targetId
    })

    res.status(201).send('Invitation sent successfully')
  } catch (e) {
    res.status(500).send(e);
  }
};
