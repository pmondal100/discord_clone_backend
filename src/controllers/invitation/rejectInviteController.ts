import { Request, Response } from "express";
import { currentUser } from "../../storage/serverStorage";
import { rejectInvite } from "../../socketHandlers/inviteNotification";

const rejectInviteController = (req: Request, res: Response): void => {
  try {
    rejectInvite(req.body.id, currentUser);
    res.status(201).send("Invite rejected successfully.");
  } catch (e) {
    res.status(500).send("Something went wrong, please try again.");
  }
};

export default rejectInviteController;
