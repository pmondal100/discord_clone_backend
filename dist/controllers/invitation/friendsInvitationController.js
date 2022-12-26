"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inviteController_1 = require("./inviteController");
const rejectInviteController_1 = __importDefault(require("./rejectInviteController"));
const acceptInviteController_1 = __importDefault(require("./acceptInviteController"));
const controllers = {
    inviteController: inviteController_1.inviteController,
    rejectInviteController: rejectInviteController_1.default,
    acceptInviteController: acceptInviteController_1.default
};
exports.default = controllers;
