"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: parseInt(process.env.PORT || '3000'),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '13'),
    SECRET_KEY: process.env.SECRET_KEY || 'SECRET_KEY',
    DB_CONNECTION: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}` || ''
};
