"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInvite = void 0;
const invitationModel_1 = __importDefault(require("../models/invitationModel"));
const userInvite = (user_doc_id) => __awaiter(void 0, void 0, void 0, function* () {
    // const currUserSockets = [];
    const pendingInvitations = yield invitationModel_1.default.find({
        receiverId: user_doc_id
    }).populate('receiverId', '_id username email');
    // onlineUsersData.forEach((value, key) => {
    //     if(value.userId === user_doc_id.toString()){
    //         currUserSockets.push(key);
    //     }
    // })
});
exports.userInvite = userInvite;
