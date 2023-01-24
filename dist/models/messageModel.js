"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const messageSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: { type: Date },
    type: { type: String },
    content: { type: String }
});
exports.default = mongoose_1.default.model('Message', messageSchema);
