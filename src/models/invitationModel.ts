import mongoose from "mongoose";
import { Schema } from "mongoose";

const invitationSchema = new mongoose.Schema({
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
})

export default mongoose.model('Invitation', invitationSchema);