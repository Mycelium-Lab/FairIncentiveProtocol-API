"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const networks = [
    {
        name: 'Mumbai',
        chainid: '80001',
        rpc: 'https://rpc-mumbai.maticvigil.com',
        private_key: process.env.PRIVATE_KEY || ''
    },
    {
        name: 'BNB Test',
        rpc: "https://bsc-testnet.publicnode.com",
        chainid: "97",
        private_key: process.env.PRIVATE_KEY || ''
    }
];
exports.config = {
    PORT: parseInt(process.env.PORT || '3000'),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '13'),
    SECRET_KEY: process.env.SECRET_KEY || 'SECRET_KEY',
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY || 'NFT_STORAGE_KEY',
    DB_CONNECTION: process.env.STATUS === "prod"
        ?
            `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
        :
            `postgresql://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASSWORD}@${process.env.TEST_DB_HOST}/${process.env.TEST_DB_NAME}`,
    networks,
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || 'MAILGUN_API_KEY'
};
