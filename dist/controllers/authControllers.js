"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginController_1 = __importDefault(require("./loginController"));
const registerController_1 = __importDefault(require("./registerController"));
const controllers = {
    loginController: loginController_1.default,
    registerController: registerController_1.default
};
exports.default = controllers;
