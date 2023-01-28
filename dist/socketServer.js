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
exports.registerSocketServer = exports.ioInstance = void 0;
const socketJWTCheck_1 = require("./socketHandlers/socketJWTCheck");
const serverStorage_1 = require("./storage/serverStorage");
const directMessageHandler_1 = __importDefault(require("./socketHandlers/directMessageHandler"));
const registerSocketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    exports.ioInstance = io;
    io.use(socketJWTCheck_1.jwtCheck);
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('connect', socket.id);
        (0, serverStorage_1.setUserData)(socket, 'addUser');
        socket.on('disconnect', () => {
            console.log('disconnect', socket.id);
            (0, serverStorage_1.setUserData)(socket, 'removeUser');
        });
        socket.on('disconnected', () => {
            console.log('disconnected', socket.id);
            (0, serverStorage_1.setUserData)(socket, 'removeUser');
        });
        socket.on('direct-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const userObj = yield (0, serverStorage_1.getUserFromSocketId)(data.socketId);
            (0, directMessageHandler_1.default)(data, userObj._id.toString());
        }));
    }));
};
exports.registerSocketServer = registerSocketServer;
