import { currentUser } from "../../storage/serverStorage";
import { acceptInvite } from "../../socketHandlers/inviteNotification";
import { Request, Response } from "express";

const acceptInviteController = (req: Request, res: Response): void => {
  try {
    acceptInvite(req.body.id, currentUser);
    res.status(201).send('Request accepted successfully.');
  } catch (e) {
    res.status(500).send("Something went wrong, please try again.");
  }
};

export default acceptInviteController;
