import User from '../models/userModel';
import Invitation from '../models/invitationModel';
import { ObjectId } from 'mongoose';
import { onlineUsersData } from '../storage/serverStorage';

export const userInvite = async (user_doc_id: ObjectId) => {
    // const currUserSockets = [];

    const pendingInvitations = await Invitation.find({
        receiverId: user_doc_id
    }).populate('receiverId', '_id username email');

    // onlineUsersData.forEach((value, key) => {
    //     if(value.userId === user_doc_id.toString()){
    //         currUserSockets.push(key);
    //     }
    // })
}