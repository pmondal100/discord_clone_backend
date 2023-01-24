import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: { type: Date },
    type: { type: String },
    content: { type: String }
})

export default mongoose.model('Message', messageSchema);