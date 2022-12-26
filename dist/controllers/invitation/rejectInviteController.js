"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverStorage_1 = require("../../storage/serverStorage");
const inviteNotification_1 = require("../../socketHandlers/inviteNotification");
const rejectInviteController = (req, res) => {
    try {
        (0, inviteNotification_1.rejectInvite)(req.body.id, serverStorage_1.currentUser);
        res.status(201).send("Invite rejected successfully.");
    }
    catch (e) {
        res.status(500).send("Unable to reject the invitation.");
    }
};
exports.default = rejectInviteController;
