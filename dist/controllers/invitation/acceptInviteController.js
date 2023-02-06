"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inviteNotification_1 = require("../../socketHandlers/inviteNotification");
const acceptInviteController = (req, res) => {
    try {
        (0, inviteNotification_1.acceptInvite)(req.body.recieverMail, req.body.senderId);
        res.status(201).send('Request accepted successfully.');
    }
    catch (e) {
        res.status(500).send("Something went wrong, please try again.");
    }
};
exports.default = acceptInviteController;
