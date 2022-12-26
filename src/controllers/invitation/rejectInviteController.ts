import { Request, Response } from "express";
import { currentUser } from "../../storage/serverStorage";
import { rejectInvite } from "../../socketHandlers/inviteNotification";

const rejectInviteController = (req: Request, res: Response) => {
  try {
    rejectInvite(req.body.id, currentUser);
    res.status(201).send("Invite rejected successfully.");
  } catch (e) {
    res.status(500).send("Unable to reject the invitation.");
  }
};

export default rejectInviteController;
